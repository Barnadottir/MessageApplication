# **Oskar&Alex Message App**

Welcome to the production version of the **Oskar&Alex Message App**! Follow the steps below to get started.

---

## **Getting Started**

### **1. Clone the Repository**
```bash
git clone <repository-url>
cd backend
npm install
poetry install
poetry run fastapi dev app/main.py
cd frontend
npm install
npm run dev
ngrok start --config=ngrok.yml --all
```

2. in /backend/main.py change allowed urls, to what is displayed after "forwarding" for the frontend
3. in /frontend/api.py change allowed urls, axiosInstance URL to what is being displayed after "forwarding" for the backend
