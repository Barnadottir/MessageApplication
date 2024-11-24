[supervisord]
nodaemon=true

[inet_http_server]
port=127.0.0.1:9002

[program:backend]
command=bash -c 'ORIGINS="http://localhost:5174" PYTHONUNBUFFERED=1 poetry run fastapi dev app/main.py --host "localhost" --port 8000'
directory=./backend
autostart=true
autorestart=true
# redirect_stderr=true

[program:frontend]
command=bash -c 'BACKEND_URI="http://localhost:8000" npm run dev -- --port 5174'
directory=./frontend
autostart=true
autorestart=true