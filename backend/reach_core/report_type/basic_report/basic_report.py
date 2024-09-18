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
            cadence,
            retained_text,
            deleted_text,
            file_url
        ):
        self.query = query
        self.report_type = report_type
        self.source_urls = source_urls
        self.sources = sources
        self.config_path = config_path
        self.websocket = websocket
        self.cadence = cadence
        self.retained_text = retained_text
        self.deleted_text = deleted_text
        self.file_url = file_url

    async def run(self):
        # Initialize researcher
        researcher = Reach(
            self.query, 
            self.report_type, 
            self.source_urls, 
            self.sources, 
            self.config_path, 
            self.websocket,
            cadence = self.cadence,
            retained_text = self.retained_text,
            deleted_text = self.deleted_text,
            file_url = self.file_url
        )

        # Run research
        await researcher.conduct_research()

        # and generate report        
        report = await researcher.write_report()

        return report 