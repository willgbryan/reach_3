import io
import requests
import time
import aiofiles
from PyPDF2 import PdfReader
# import pytesseract
import tempfile
import uuid
import shutil
from pyzerox import zerox
from PIL import Image
import img2pdf
import docx2txt
from urllib.parse import urlparse, unquote
from typing import List, Dict
from reach_core.config import Config
from reach_core.master.functions import *
from reach_core.context.compression import ContextCompressor
from reach_core.memory import Memory
from reach_core.utils.enum import ReportType


class Reach:
    """
    Reach
    """
    def __init__(
         self,
         query: str, 
         report_type: str=ReportType.ResearchReport.value,
         source_urls=None, 
         sources=["WEB"],
         config_path=None, 
         websocket=None,
         cadence="",
         agent=None,
         role=None,
         parent_query="",
         subtopics=[],
         visited_urls=set(),
         retained_text="",
         deleted_text="",
         file_urls=[]
     ):
        """
        Initialize the Reach class.
        Args:
            query:
            report_type:
            config_path:
            websocket:
        """
        self.query = query
        self.agent = agent
        self.role = role
        self.report_type = report_type
        self.websocket = websocket
        self.cadence = cadence
        self.cfg = Config(config_path)
        self.retriever = get_retriever(self.cfg.retriever)
        self.context = []
        self.source_urls = source_urls
        self.sources = sources
        self.memory = Memory(self.cfg.embedding_provider)
        self.visited_urls = visited_urls
        self.retained_text = retained_text
        self.deleted_text = deleted_text
        self.file_urls = file_urls

        # Only relevant for DETAILED REPORTS
        # --------------------------------------

        # Stores the main query of the detailed report
        self.parent_query = parent_query

        # Stores all the user provided subtopics
        self.subtopics = subtopics

    async def conduct_research(self):
        """
        Returns:
            Report
        """
        print(f"Running research for '{self.query}'...")
        print(f"Sources: {self.sources}")
        # Generate Agent
        self.agent, self.role = await choose_agent(self.query, self.cfg)
        # await stream_output("logs", self.agent, self.websocket)

        # If specified, the researcher will use the given urls as the context for the research.
        self.context = []
        for source in self.sources:
            if source == "WEB":
                self.context += await self.get_context_by_search(self.query)
            if source == "FILES":
                self.context += await self.get_context_by_file_uploads(self.query)
            if source == "SYSTEMS":
                self.context += await self.get_context_by_systems(self.query)

        if self.source_urls:
            self.context += await self.get_context_by_urls(self.source_urls)

        time.sleep(2)

    async def write_report(self, existing_headers: list = []):
        """
        Writes the report based on research conducted
        Returns:
            str: The report
        """
        # Write Research Report
        if self.report_type == "custom_report":
            self.role = self.cfg.agent_role if self.cfg.agent_role else self.role

        # await stream_output("logs", f"✍️ Writing summary for research task: {self.query}...", self.websocket)

        if self.report_type == "custom_report":
            self.role = (
                self.cfg.agent_role if self.cfg.agent_role else self.role
            )
        elif self.report_type == "subtopic_report":
            report = await generate_report(
                query=self.query,
                context=self.context,
                agent_role_prompt=self.role,
                report_type=self.report_type,
                websocket=self.websocket,
                cfg=self.cfg,
                main_topic=self.parent_query,
                existing_headers=existing_headers,
                retained_text=self.retained_text,
                deleted_text=self.deleted_text,
                cadence=self.cadence
            )
        else:
            report = await generate_report(
                query=self.query, 
                context=self.context,
                agent_role_prompt=self.role, 
                report_type=self.report_type,
                websocket=self.websocket, 
                cfg=self.cfg,
                retained_text=self.retained_text,
                deleted_text=self.deleted_text,
                cadence=self.cadence
            )

        return report

    async def get_context_by_urls(self, urls):
        """
            Scrapes and compresses the context from the given urls
        """
        new_search_urls = await self.get_new_urls(urls)
        # await stream_output("logs",
        #                     f"I will conduct my research based on the following urls: {new_search_urls}...",
        #                     self.websocket)
        scraped_sites = scrape_urls(new_search_urls, self.cfg)
        web_results = await self.get_similar_content_by_query(self.query, scraped_sites)

        return web_results

    async def get_context_by_file_uploads(self, query: str) -> List[str]:
        """
        Generates the context for the research task by searching the query and scraping the results
        from the uploaded files
        Returns:
        context: List of context
        """
        content = []
        try:
            parsed_content: List[Dict[str, str]] = []
            first_1000_chars_list = []
            
            for file_url in self.file_urls:
                await stream_output("logs", f'Processing file: {file_url}', self.websocket)
                
                try:
                    parsed_url = urlparse(file_url)
                    file_path = unquote(parsed_url.path)
                    file_name = os.path.basename(file_path)
                    
                    temp_dir = tempfile.mkdtemp()
                    _, file_extension = os.path.splitext(file_name)
                    file_extension = file_extension.lower()
                    
                    temp_filename = f"{uuid.uuid4().hex[:8]}{file_extension}"
                    temp_file_path = os.path.join(temp_dir, temp_filename)
                    
                    response = requests.get(file_url)
                    response.raise_for_status()
                    file_content = response.content
                    
                    file_text = ""
                    
                    if file_extension == '.pdf':
                        pdf_reader = PdfReader(io.BytesIO(file_content))
                        for page in pdf_reader.pages:
                            file_text += page.extract_text()
                            
                    elif file_extension in ['.png', '.jpg', '.jpeg', '.gif', '.bmp']:
                        with open(temp_file_path, 'wb') as f:
                            f.write(file_content)
                        
                        try:
                            with Image.open(temp_file_path) as img:
                                if img.mode in ('RGBA', 'LA'):
                                    background = Image.new('RGB', img.size, 'white')
                                    background.paste(img, mask=img.split()[-1])
                                    img = background
                                elif img.mode != 'RGB':
                                    img = img.convert('RGB')
                                
                                temp_img_path = os.path.join(temp_dir, 'converted_image.jpg')
                                img.save(temp_img_path, 'JPEG')
                            
                            temp_pdf_path = os.path.join(temp_dir, 'converted.pdf')
                            with open(temp_pdf_path, "wb") as f:
                                f.write(img2pdf.convert(temp_img_path))
                            
                            await stream_output("logs", f"Processing converted PDF with zerox", self.websocket)
                            markdown_output = await zerox(
                                file_path=temp_pdf_path,
                                model="gpt-4o-mini",
                                custom_system_prompt=None,
                                output_dir=temp_dir
                            )
                            
                            if markdown_output is None or not str(markdown_output).strip():
                                await stream_output("logs", f"Warning: OCR processing returned no text for {file_name}", self.websocket)
                                file_text = "No text could be extracted from this image."
                            else:
                                file_text = str(markdown_output).strip()
                                
                        except Exception as e:
                            await stream_output("logs", f"Error converting image to PDF: {str(e)}", self.websocket)
                            file_text = "Error processing image file."
                            
                    elif file_extension in ['.doc', '.docx']:
                        file_text = docx2txt.process(io.BytesIO(file_content))
                        
                    elif file_extension == '.txt':
                        file_text = file_content.decode('utf-8')
                        
                    else:
                        await stream_output("logs", f"Unsupported file type: {file_extension}", self.websocket)
                        continue
                    
                    if file_text and str(file_text).strip():
                        parsed_content.append({
                            "url": file_url,
                            "raw_content": file_text
                        })
                        first_1000_chars_list.append(str(file_text)[:1000])

                        await stream_output("original_contract", file_text, self.websocket)
                    else:
                        await stream_output("logs", f"Warning: No content extracted from {file_name}", self.websocket)
                    
                    try:
                        shutil.rmtree(temp_dir)
                    except Exception as e:
                        await stream_output("logs", f"Warning: Could not clean up temporary files: {str(e)}", self.websocket)
                        
                except Exception as e:
                    await stream_output("logs", f"Error processing file {file_name}: {str(e)}", self.websocket)
                    continue
            
            if not first_1000_chars_list:
                await stream_output("logs", "Warning: No content could be extracted from any files", self.websocket)
                return content
                
            all_first_1000_chars = "\n\n".join(first_1000_chars_list)
            enhanced_query = f"{query}\n\nFirst 1000 characters of each document:\n{all_first_1000_chars}"
            
            sub_queries = await get_sub_queries(enhanced_query, self.role, self.cfg, self.parent_query, self.report_type,
                                            self.websocket, self.cadence, self.retained_text, self.deleted_text)
            
            if sub_queries:
                for sub_query in sub_queries:
                    await stream_output("logs", f"Processing sub-query: {sub_query}", self.websocket)
                    document_content = await self.get_similar_content_by_query(sub_query, parsed_content)
                    if document_content:
                        content.append(document_content)
                    else:
                        await stream_output("logs", f"No content found for '{sub_query}'...", self.websocket)
            else:
                await stream_output("logs", "Warning: No sub-queries were generated", self.websocket)
                
        except Exception as e:
            await stream_output("logs", f"Error processing files: {str(e)}", self.websocket)
            raise
            
        return content
    
    async def get_context_by_systems(self, query):
        """
           Generates the context for the research task by searching the query and scraping the results
           from the available system connections
        Returns:
            context: List of context
        """
        content = []
        sub_queries = await get_sub_queries(query, self.role, self.cfg, self.parent_query, self.report_type, self.websocket) + [query]
        # await stream_output("logs",
        #                     f"I will conduct my research based on the following queries: {sub_queries}...",
        #                     self.websocket)

        for sub_query in sub_queries:
            # await stream_output("logs", f"\nRunning research for '{sub_query}'...", self.websocket)

            parsed_content: List[Dict[str, str]] = []
            parsed_systems_path = "hubspot/parsed_app.json"
            async with aiofiles.open(parsed_systems_path, "r") as file:
                read_content = await file.read()
                if read_content:
                    parsed_content = json.loads(read_content)
                    
            document_content = await self.get_similar_content_by_query(sub_query, parsed_content)

            if document_content:
                # await stream_output("logs", f"{document_content}", self.websocket)
                content.append(document_content)
            else:
                # await stream_output("logs", f"No content found for '{sub_query}'...", self.websocket)
                pass
        return content


    async def get_context_by_search(self, query):
        """
           Generates the context for the research task by searching the query and scraping the results
        Returns:
            context: List of context
        """

        content = []
        sub_queries = await get_sub_queries(query, self.role, self.cfg, self.parent_query, self.report_type, 
                                            self.websocket, self.cadence, self.retained_text, self.deleted_text) + [query]
        # await stream_output("logs",
        #                     f"I will conduct my research based on the following queries: {sub_queries}...",
        #                     self.websocket)
        content = []
        all_docs_dicts = []

        # Run Sub-Queries
        for sub_query in sub_queries:
            scraped_sites = await self.scrape_sites_by_query(sub_query)
            web_content, docs_dict = await self.get_similar_content_by_query(sub_query, scraped_sites)

            if web_content:
                content.append(web_content)
                all_docs_dicts.extend(docs_dict)
            else:
                pass

        await stream_output("sources", all_docs_dicts, self.websocket)

        return content

    async def get_new_urls(self, url_set_input):
        """ Gets the new urls from the given url set.
        Args: url_set_input (set[str]): The url set to get the new urls from
        Returns: list[str]: The new urls from the given url set
        """

        new_urls = []
        for url in url_set_input:
            if url not in self.visited_urls:
                # await stream_output("logs", f"Adding source url to research: {url}\n", self.websocket)

                self.visited_urls.add(url)
                new_urls.append(url)

        return new_urls

    async def scrape_sites_by_query(self, sub_query):
        """
        Runs a sub-query
        Args:
        sub_query:
        Returns:
        Summary
        """
        # Get Urls
        retriever = self.retriever(sub_query)
        try:
            search_results = retriever.search(max_results=self.cfg.max_search_results_per_query)
            new_search_urls = await self.get_new_urls([url.get("href") for url in search_results if url.get("href")])
            
            # Scrape Urls
            # await stream_output("logs", f"📝Scraping urls {new_search_urls}...\n", self.websocket)
            # await stream_output("logs", f"Researching for relevant information...\n", self.websocket)
            scraped_content_results = scrape_urls(new_search_urls, self.cfg)
            return scraped_content_results
        except Exception as e:
            print(f"Error in scrape_sites_by_query for sub_query '{sub_query}': {str(e)}")
            return []

    async def get_similar_content_by_query(self, query, pages):
        # await stream_output("logs", f"Getting relevant content based on query: {query}...", self.websocket)
        # Summarize Raw Data
        context_compressor = ContextCompressor(documents=pages, embeddings=self.memory.get_embeddings())
        # Run Tasks
        return context_compressor.get_context(query, max_results=8)
    

    ########################################################################################

    # DETAILED REPORT

    async def write_introduction(self):
        # Construct Report Introduction from main topic research
        introduction = await get_report_introduction(self.query, self.context, self.role, self.cfg, self.websocket, self.cadence)

        return introduction

    async def get_subtopics(self):
        """
        This async function generates subtopics based on user input and other parameters.
        
        Returns:
        The `get_subtopics` function is returning the `subtopics` that are generated by the
        `construct_subtopics` function.
        """
        # await stream_output("logs", f"Generating subtopics...", self.websocket)

        subtopics = await construct_subtopics(
            task=self.query,
            data=self.context,
            config=self.cfg,
            # This is a list of user provided subtopics
            subtopics=self.subtopics,
        )

        # await stream_output("logs", f"Subtopics: {subtopics}", self.websocket)

        return subtopics 

