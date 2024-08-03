from http.client import HTTPException
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect, File, UploadFile, Form
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
import json
import os
import logging
import aiofiles
from typing import List
from reach_core.utils.websocket_manager import WebSocketManager
# from reach_core.utils.unstructured_functions import *
# from reach_core.utils.hubspot_functions import *
# from reach_core.utils.whisper_functions import *
from reach_core.utils.mp3_from_mp4 import mp4_to_mp3
# from utils import write_md_to_pdf
from datetime import datetime


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
                print(f"ws edits {edits}")
                if task and report_type:
                    await manager.start_streaming(task, report_type, sources, websocket, edits)
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
