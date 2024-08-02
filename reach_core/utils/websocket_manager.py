# connect any client to gpt-researcher using websocket
import asyncio
import datetime
from typing import Dict, List

from fastapi import WebSocket

from reach_core.report_type import BasicReport, DetailedReport

from .enum import ReportType

class WebSocketManager:
    """Manage websockets"""
    def __init__(self):
        """Initialize the WebSocketManager class."""
        self.active_connections: List[WebSocket] = []
        self.sender_tasks: Dict[WebSocket, asyncio.Task] = {}
        self.message_queues: Dict[WebSocket, asyncio.Queue] = {}

    async def start_sender(self, websocket: WebSocket):
        """Start the sender task."""
        queue = self.message_queues.get(websocket)
        if not queue:
            return

        while True:
            message = await queue.get()
            if websocket in self.active_connections:
                try:
                    await websocket.send_text(message)
                except:
                    break
            else:
                break

    async def connect(self, websocket: WebSocket):
        """Connect a websocket."""
        await websocket.accept()
        self.active_connections.append(websocket)
        self.message_queues[websocket] = asyncio.Queue()
        self.sender_tasks[websocket] = asyncio.create_task(self.start_sender(websocket))

    async def disconnect(self, websocket: WebSocket):
        """Disconnect a websocket."""
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            self.sender_tasks[websocket].cancel()
            await self.message_queues[websocket].put(None)
            del self.sender_tasks[websocket]
            del self.message_queues[websocket]

    async def start_streaming(self, task, report_type, sources, websocket, edits=None):
        """Start streaming the output."""
        retained_text = ""
        deleted_text = ""
        if edits:
            for part in edits.split():
                if part.startswith('user-retained:'):
                    retained_text += part[14:] + " "
                elif part.startswith('user-deleted:'):
                    deleted_text += part[13:] + " "
        await run_agent(task, report_type, sources, websocket, retained_text.strip(), deleted_text.strip())
        # return report


async def run_agent( task, report_type, sources, websocket, retained_text, deleted_text):
        """Run the agent."""
        start_time = datetime.datetime.now()
        config_path = None

        try:
            if report_type == ReportType.DetailedReport.value:
                researcher = DetailedReport(query=task, report_type=report_type,
                                            source_urls=None, sources=sources, config_path=config_path, websocket=websocket)
            else:
                researcher = BasicReport(query=task, report_type=report_type,
                                         source_urls=None, sources=sources, config_path=config_path, websocket=websocket, 
                                         retained_text=retained_text, deleted_text=deleted_text)

            await researcher.run()
            
            end_time = datetime.datetime.now()
            run_time = end_time - start_time
            
            # await websocket.send_json({"type": "logs", "output": f"\nTotal run time: {run_time}\n"})
            
            # Send the report in chunks to avoid potential size limitations
            # chunk_size = 1000
            # for i in range(0, len(report), chunk_size):
            #     chunk = report[i:i+chunk_size]
            #     print(f"chunk {chunk}")
            # await websocket.send_json({"type": "report", "output": report})
            
            print(f"Agent run completed. Run time: {run_time}")
            # return report
        except Exception as e:
            print(f"Error in run_agent: {str(e)}")
            await websocket.send_json({"type": "error", "message": str(e)})
            return None