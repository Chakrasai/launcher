import os
import json
import subprocess
import socketio # type: ignore
from aiohttp import web # type: ignore

sio = socketio.AsyncServer(async_mode='aiohttp')
app = web.Application()
sio.attach(app)

@sio.event
async def connect(sid, environ):
    print('backend connected:', sid)
@sio.event
async def launch(sid,data):
    print("received launch data:", data)
    apps = data.get("apps", [])
    websites = data.get("websites", [])

    for app in apps:
        if os.name == 'nt':
            cmd = f'start "" "{app}"'
        else:
            cmd = f'open -a "{app}"'  
        try:
            subprocess.run(cmd, shell=True, check=True)
            print(f'Launched app: {app}')
            await sio.emit("launchsuccess", {"app": app, "message": f"{app} launched successfully"}, to=sid)
        except subprocess.CalledProcessError as e:
            print(f'Failed to launch app: {app}, error: {e}')
            await sio.emit("launchfailure", {"app": app, "message": f"Failed to launch {app}"}, to=sid)

@sio.event
async def disconnect(sid):
    print('backend disconnected:', sid)

if __name__ == '__main__':
    port = 5000
    host = 'localhost'
    print(f"Starting local service on {host}:{port}")
    web.run_app(app, host=host, port=port)
    print(f"Local service started on {host}:{port}")
