from concurrent.futures.thread import ThreadPoolExecutor
from langchain.document_loaders import PyMuPDFLoader
from langchain.retrievers import ArxivRetriever
from youtube_transcript_api import YouTubeTranscriptApi
from functools import partial
import requests
from bs4 import BeautifulSoup
from newspaper import Article
import re
from urllib.parse import urlparse

class Scraper:
    """
    Scraper class to extract the content from the links
    """
    def __init__(self, urls, user_agent, scraper):
        """
        Initialize the Scraper class.
        Args:
            urls:
        """
        self.urls = urls
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": user_agent
        })
        self.scraper = scraper

    def run(self):
        """
        Extracts the content from the links
        """
        partial_extract = partial(self.extract_data_from_link, session=self.session)
        with ThreadPoolExecutor(max_workers=20) as executor:
            contents = executor.map(partial_extract, self.urls)
        res = [content for content in contents if content['raw_content'] is not None]
        return res

    def is_valid_url(self, url):
        """
        Check if the URL is valid.
        """
        try:
            result = urlparse(url)
            return all([result.scheme, result.netloc])
        except ValueError:
            return False

    def extract_data_from_link(self, link, session):
        """
        Extracts the data from the link
        """
        content = ""
        try:
            if not self.is_valid_url(link):
                print(f"Invalid URL: {link}")
                return {'url': link, 'raw_content': None}

            if link.endswith(".pdf"):
                content = self.scrape_pdf_with_pymupdf(link)
            elif "arxiv.org" in link:
                doc_num = link.split("/")[-1]
                content = self.scrape_pdf_with_arxiv(doc_num)
            elif "youtube.com" in link or "youtu.be" in link:
                content = self.scrape_youtube_transcripts(link)
            elif link and self.scraper=="bs":
                content = self.scrape_text_with_bs(link, session)
            else:
                content = self.scrape_url_with_newspaper(link)

            print(f"Scraped content length for {link}: {len(content)}")
            
            if len(content) < 100:
                print(f"Content too short for {link}")
                return {'url': link, 'raw_content': None}
            return {'url': link, 'raw_content': content}
        except requests.exceptions.RequestException as e:
            print(f"Network error while scraping {link}: {str(e)}")
        except Exception as e:
            print(f"Error scraping {link}: {str(e)}")
        return {'url': link, 'raw_content': None}

    def scrape_youtube_transcripts(self, url: str) -> str:
        """Scrape transcript from a Youtube video url"""
        video_id = re.search(r'(?:v=|\/)([0-9A-Za-z_-]{11}).*', url)
        if not video_id:
            print(f"Invalid YouTube URL: {url}")
            return ""
        video_id = video_id.group(1)
        try:
            transcript = YouTubeTranscriptApi.get_transcript(video_id)
            return ' '.join(x['text'] for x in transcript)
        except Exception as e:
            print(f"Error scraping YouTube transcript for {url}: {str(e)}")
            return ""

    def scrape_text_with_bs(self, link, session):
        try:
            response = session.get(link, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'lxml', from_encoding=response.encoding)

            for script_or_style in soup(["script", "style"]):
                script_or_style.extract()

            raw_content = self.get_content_from_url(soup)
            lines = (line.strip() for line in raw_content.splitlines())
            chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
            return "\n".join(chunk for chunk in chunks if chunk)
        except requests.exceptions.RequestException as e:
            print(f"Error fetching {link}: {str(e)}")
            return ""

    def scrape_url_with_newspaper(self, url) -> str:
        try:
            article = Article(url, language="en", memoize_articles=False, fetch_images=False)
            article.download()
            article.parse()

            title = article.title
            text = article.text

            if not (title and text):
                print(f"No content found for {url}")
                return ""

            return f"{title} : {text}"
        except Exception as e:
            print(f"Error scraping {url} with newspaper: {str(e)}")
            return ""

    def scrape_pdf_with_pymupdf(self, url) -> str:
        try:
            loader = PyMuPDFLoader(url)
            doc = loader.load()
            return str(doc)
        except Exception as e:
            print(f"Error scraping PDF {url}: {str(e)}")
            return ""

    def scrape_pdf_with_arxiv(self, query) -> str:
        try:
            retriever = ArxivRetriever(load_max_docs=2, doc_content_chars_max=None)
            docs = retriever.get_relevant_documents(query=query)
            return docs[0].page_content
        except Exception as e:
            print(f"Error scraping arXiv PDF for query {query}: {str(e)}")
            return ""

    def get_content_from_url(self, soup):
        text = ""
        tags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5']
        for element in soup.find_all(tags):
            text += element.text + "\n"
        return text