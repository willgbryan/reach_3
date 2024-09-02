import markdown2
from bs4 import BeautifulSoup
from http.client import HTTPException
import traceback
from supabase_utils.pptx_utils import read_pptx_from_supabase, render_html_to_slide
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import Response, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import json
import os
import io
import logging
from typing import List
from reach_core.utils.websocket_manager import WebSocketManager
from reach_core.master.prompts import generate_report_prompt
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI

# from reach_core.utils.unstructured_functions import *
# from reach_core.utils.hubspot_functions import *
# from reach_core.utils.whisper_functions import *
from reach_core.utils.mp3_from_mp4 import mp4_to_mp3
# from utils import write_md_to_pdf
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ResearchRequest(BaseModel):
    task: str
    report_type: str
    agent: str
    sources: List[str] = []

class SalesforceCredentials(BaseModel):
    username: str
    consumer_key: str
    private_key_path: str

class HubspotCredentials(BaseModel):
    access_token: str

def make_serializable(data):
    if isinstance(data, dict):
        return {key: make_serializable(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [make_serializable(item) for item in data]
    elif isinstance(data, datetime):
        return data.isoformat()
    elif hasattr(data, '__dict__'):
        return {key: make_serializable(value) for key, value in data.__dict__.items()}
    else:
        return data

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://themagi.systems", "https://www.themagi.systems", "wss://themagi.systems"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TaskRequest(BaseModel):
    task: str
    report_type: str
    sources: List[str]

manager = WebSocketManager()


# Dynamic directory for outputs once first research is run
@app.on_event("startup")
def startup_event():
    if not os.path.isdir("outputs"):
        os.makedirs("outputs")
    app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")

# @app.get("/")
# async def read_root(request: Request):
#     return templates.TemplateResponse('index.html', {"request": request, "report": None})

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    logger.info("WebSocket connected")
    # logger.info(f"Received WebSocket data: {data}")
    try:
        while True:
            data = await websocket.receive_text()
            try:
                json_data = json.loads(data)
                print(f"raw data {json_data}")
                task = json_data.get("task")
                report_type = json_data.get("report_type")
                sources = json_data.get("sources", [])
                edits = json_data.get("edits")  #None if not present
                cadence = json_data.get("cadence")
                print(f"ws edits {edits}")
                if task and report_type:
                    await manager.start_streaming(task, report_type, sources, websocket, cadence, edits)
                    await websocket.send_json({"type": "complete"})
                else:
                    await websocket.send_json({"type": "error", "message": "Missing required parameters"})
            except json.JSONDecodeError:
                logging.error(f"Invalid JSON received: {data}")
                await websocket.send_json({"type": "error", "message": "Invalid JSON format"})
            except Exception as e:
                logging.error(f"Error processing request: {str(e)}")
                await websocket.send_json({"type": "error", "message": "Internal server error"})
    except WebSocketDisconnect:
        await manager.disconnect(websocket)

client = OpenAI()

class SlideContent(BaseModel):
    title: str
    content: List[str]

class PresentationStructure(BaseModel):
    title: str
    slides: List[SlideContent]

class PowerPointRequest(BaseModel):
    prompt: str
    filePath: str
    favoriteTheme: str
    signedUrl: str

@app.post("/generate-powerpoint")
async def generate_powerpoint(request: PowerPointRequest):
    try:
        print(f"Received request with prompt: {request.prompt}")
        print(f"File path: {request.filePath}")
        print(f"Favorite theme: {request.favoriteTheme}")
        print(f"Signed URL: {request.signedUrl}")

        prs = read_pptx_from_supabase(request.filePath, request.signedUrl)

        completion = client.chat.completions.create(
            model="gpt-4o-2024-08-06",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that creates PowerPoint presentations. Generate a presentation structure based on the user's request by calling the create_presentation function."},
                {"role": "user", "content": f"Create a presentation summarizing the following content. Be sure to include the links in a References slide, and preserve tables: {request.prompt}"}
            ],
            functions=[{
                "name": "create_presentation",
                "description": "Create a PowerPoint presentation structure",
                "parameters": PresentationStructure.schema()
            }],
            function_call={"name": "create_presentation"}
        )
        print("OpenAI API response received")

        function_call = completion.choices[0].message.function_call
        if not function_call or function_call.name != "create_presentation":
            raise ValueError("Unexpected response from OpenAI API")

        presentation_data = json.loads(function_call.arguments)
        print(f"Presentation data: {presentation_data}")

        trim_count = len(prs.slides)

        title_slide_layout = prs.slide_layouts[0]
        title_slide = prs.slides.add_slide(title_slide_layout)
        
        title = title_slide.shapes.title
        subtitle = next((ph for ph in title_slide.placeholders if ph.placeholder_format.idx != 0), None)
        
        if title:
            title.text = presentation_data["title"]
        if subtitle:
            subtitle.text = "Generated Presentation"
        
        content_slide_layout = prs.slide_layouts[1]
        for slide_data in presentation_data["slides"]:
            new_slide = prs.slides.add_slide(content_slide_layout)
            
            title = new_slide.shapes.title
            if title:
                title.text = slide_data["title"]
            
            for item in slide_data["content"]:
                html_content = markdown2.markdown(item)
                soup = BeautifulSoup(html_content, 'html.parser')

                render_html_to_slide(new_slide, soup)

        for _ in range(trim_count):
            rId = prs.slides._sldIdLst[0].rId
            prs.part.drop_rel(rId)
            del prs.slides._sldIdLst[0]

        ppt_bytes = io.BytesIO()
        prs.save(ppt_bytes)
        ppt_bytes.seek(0)
        print("Presentation generated successfully")

        return Response(
            content=ppt_bytes.getvalue(),
            media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
            headers={"Content-Disposition": "attachment; filename=generated_presentation.pptx"}
        )
    except Exception as e:
        print(f"Error in generate_powerpoint: {str(e)}")
        print(traceback.format_exc())
        return JSONResponse(status_code=500, content={"detail": str(e)})

class CondenseRequest(BaseModel):
    task: str
    accumulatedOutput: str
    
@app.post("/condense-findings")
async def generate_powerpoint(request: CondenseRequest):
    user_prompt = generate_report_prompt(
        question=request.task,
        context=request.accumulatedOutput
    )

    prompt = f"""
    You are a seasoned analyst. \n
    Your primary goal is to compose comprehensive, astute, impartial, and methodically arranged reports of the provided research.\n
    Aggregate key thematic points, quantitative findings, and tables from the provided research.
    """

    try:
        completion = client.chat.completions.create(
            model="gpt-4o-2024-08-06",
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": user_prompt}
            ],
        )
        
        condensed_report = completion.choices[0].message.content

        return {"condensed_report": condensed_report}
    except Exception as e:
        print(f"Error in condense-findings: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500)

# @app.post("/setEnvironmentVariables")
# async def set_environment_variables(credentials: SalesforceCredentials):

#     parsed_contents = await process_salesforce(
#         username=credentials.username,
#         consumer_key=credentials.consumer_key,
#         private_key=credentials.private_key_path
#     )
    
#     parsed_contents = make_serializable(parsed_contents)

#     salesforce_dir = "salesforce"
#     if not os.path.isdir(salesforce_dir):
#         os.makedirs(salesforce_dir)

#     parsed_uploads_path = f"{salesforce_dir}/parsed_app.json"
#     if not os.path.exists(parsed_uploads_path):
#         async with aiofiles.open(parsed_uploads_path, "w") as new_file:
#             await new_file.write("[]")

#     async with aiofiles.open(parsed_uploads_path, "r+") as parsed_uploads_file:
#         existing_content = await parsed_uploads_file.read()
#         existing_data = json.loads(existing_content) if existing_content else []
#         existing_data.extend(parsed_contents)
#         await parsed_uploads_file.seek(0)
#         await parsed_uploads_file.write(json.dumps(existing_data))
#         await parsed_uploads_file.truncate()


#     return {"message": "Environment variables set successfully and app processed"}

# @app.post("/setEnvironmentVariables")
# async def set_environment_variables(credentials: HubspotCredentials):
    
#     parsed_contents = await process_hubspot_crm_objects(credentials=credentials.access_token)

#     parsed_contents = make_serializable(parsed_contents)

#     hubspot_dir = "hubspot"
#     if not os.path.isdir(hubspot_dir):
#         os.makedirs(hubspot_dir)

#     parsed_uploads_path = f"{hubspot_dir}/parsed_app.json"
#     if not os.path.exists(parsed_uploads_path):
#         async with aiofiles.open(parsed_uploads_path, "w") as new_file:
#             await new_file.write("[]")

#     async with aiofiles.open(parsed_uploads_path, "r+") as parsed_uploads_file:
#         existing_content = await parsed_uploads_file.read()
#         existing_data = json.loads(existing_content) if existing_content else []
#         existing_data.extend(parsed_contents)
#         await parsed_uploads_file.seek(0)
#         await parsed_uploads_file.write(json.dumps(existing_data))
#         await parsed_uploads_file.truncate()


#     return {"message": "Environment variables set successfully and app processed"}

# @app.post("/upload")
# async def upload_files(files: List[UploadFile] = File(...), task: str = Form(...)):
#     upload_dir = "uploads"
#     if not os.path.isdir(upload_dir):
#         os.makedirs(upload_dir)

#     async def handle_file(file):
#         file_location = f"{upload_dir}/{file.filename}"
#         with open(file_location, "wb+") as file_object:
#             content = await file.read()
#             file_object.write(content)
        
#         if file.filename.endswith(".mp4"):
#             mp3_paths = await mp4_to_mp3(file_location)
#             os.remove(file_location)
#             file_location = mp3_paths[0]
        
#         return file_location

#     uploaded_files_info = []
#     for file in files:
#         file_location = await handle_file(file)
#         uploaded_files_info.append({"filename": file.filename, "location": file_location})
#         print(f"Uploaded: {file.filename} to {file_location}")

#     parsed_contents = []
#     for uploaded_file_info in uploaded_files_info:
#         parsed_audio = await parse_text_from_audio()
#         parsed_documents = await process_unstructured()
#         parsed_content = parsed_audio + parsed_documents
#         parsed_contents.extend(parsed_content)

#     parsed_uploads_path = f"{upload_dir}/parsed_uploads.json"
#     if not os.path.exists(parsed_uploads_path):
#         async with aiofiles.open(parsed_uploads_path, "w") as new_file:
#             await new_file.write("[]")

#     async with aiofiles.open(parsed_uploads_path, "r+") as parsed_uploads_file:
#         existing_content = await parsed_uploads_file.read()
#         existing_data = json.loads(existing_content) if existing_content else []
#         existing_data += parsed_contents
#         await parsed_uploads_file.seek(0)
#         await parsed_uploads_file.write(json.dumps(existing_data))
#         await parsed_uploads_file.truncate()

#     return {"info": f"Files uploaded successfully", "task": task, "parsed_info": f"Data written to {parsed_uploads_path}"}
