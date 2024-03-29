"""Main file for FastAPI server"""

from fastapi import FastAPI, Request, WebSocket
from fastapi.responses import HTMLResponse
from pyaml_env import parse_config

from chat import Chat
from static_files import static_file_response

app = FastAPI()
config = parse_config("./config.yaml")
chat = Chat()


@app.get("/api/config")
async def read_config():
    """Return config from yaml file"""
    return config


@app.websocket("/api/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        question = data.strip('"')
        answer = chat.get_answer(question)
        await websocket.send_json(answer)


# Angular static files - it have to be at the end of file
@app.get("/{full_path:path}", response_class=HTMLResponse)
async def catch_all(_: Request, full_path: str):
    """Catch all for Angular routing"""
    return static_file_response("static/browser", full_path)
