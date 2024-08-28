import os
from dotenv import load_dotenv
from supabase import create_client, Client
import requests
from pptx import Presentation
import io

load_dotenv()

supabase: Client = create_client(
    supabase_url=os.getenv("SUPABASE_URL"),
    supabase_key=os.getenv("SUPABASE_KEY")
)

def read_pptx_from_supabase(file_path: str) -> Presentation:
    try:
        response = supabase.storage.from_("slide_themes").create_signed_url(file_path, 60)
        
        if "error" in response:
            raise ValueError(f"Error getting signed URL: {response['error']}")
        
        download_url = response["signedURL"]
        
        response = requests.get(download_url)
        response.raise_for_status()
        
        ppt_bytes = io.BytesIO(response.content)
        return Presentation(ppt_bytes)
    except Exception as e:
        print(f"Error reading PowerPoint from Supabase: {str(e)}")
        raise