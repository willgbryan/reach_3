from reach_core.master.agent import Reach
from fastapi import WebSocket

class BasicReport():
    def __init__(
            self, 
            query: str, 
            report_type: str, 
            source_urls, 
            sources, 
            config_path: str, 
            websocket: WebSocket,
            retained_text,
            deleted_text
        ):
        self.query = query
        self.report_type = report_type
        self.source_urls = source_urls
        self.sources = sources
        self.config_path = config_path
        self.websocket = websocket
        self.retained_text = retained_text
        self.deleted_text = deleted_text

    async def run(self):
        # Initialize researcher
        researcher = Reach(
            self.query, 
            self.report_type, 
            self.source_urls, 
            self.sources, 
            self.config_path, 
            self.websocket,
            self.retained_text,
            self.deleted_text
        )

        # Run research
        await researcher.conduct_research()

        # and generate report        
        report = await researcher.write_report()

        return report 