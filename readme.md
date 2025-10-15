# 🚀 HubSpot Integration Platform

A full-stack **FastAPI + React** project that enables seamless **HubSpot OAuth 2.0 integration**.  
It allows users to authenticate with HubSpot, securely store access tokens in **Redis**, and fetch CRM contact data from the HubSpot API.

---

## 🧰 Tech Stack

**Backend:** FastAPI, Redis, Python (httpx, requests)  
**Frontend:** React, Axios  
**Database/Cache:** Redis  
**Authentication:** OAuth 2.0 (HubSpot)  
**Other Tools:** Uvicorn, CORS Middleware, JSON handling

---

## ⚙️ Features

✅ HubSpot OAuth 2.0 authentication flow  
✅ Secure token and state management using Redis  
✅ Automatic access token exchange and refresh  
✅ Fetch and display HubSpot contacts via API  
✅ Modular, async-based FastAPI structure  
✅ React frontend with connection status and data loading UI

---

## 🧩 Folder Structure

```
project-root/
│
├── backend/
│   ├── main.py
│   ├── integrations/
│   │   ├── hubspot.py
│   │   └── redis_client.py
│   ├── venv/
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── hubspot.js
│   │   ├── data-form.js
│   │   └── ...
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/hubspot-integration.git
cd hubspot-integration
```

---

### 2️⃣ Backend Setup (FastAPI)

Create and activate a virtual environment:

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # (Windows)
source venv/bin/activate  # (Mac/Linux)
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run Redis (make sure it’s running locally or via WSL):

```bash
redis-server
```

If Redis runs on WSL, update the `redis_host` in `redis_client.py`:

```python
redis_host = "your-wsl-ip"
```

Start FastAPI server:

```bash
uvicorn main:app --reload
```

---

### 3️⃣ Frontend Setup (React)

```bash
cd frontend
npm install
npm start
```

Your frontend will start at [http://localhost:3000](http://localhost:3000)  
and the backend will be running at [http://localhost:8000](http://localhost:8000).

---

## 🔐 HubSpot Developer App Setup

1. Go to [HubSpot Developer Portal](https://developers.hubspot.com/).
2. Create a **new private app** and note your **Client ID** and **Client Secret**.
3. Set the **Redirect URI** to:
   ```
   http://localhost:8000/integrations/hubspot/oauth2callback
   ```
4. Add required scopes (example):
   ```
   crm.objects.contacts.read
   crm.schemas.contacts.read
   ```

---

## 🧠 How the OAuth Flow Works

1. The frontend sends a request to `/integrations/hubspot/authorize` to start OAuth.
2. The user is redirected to HubSpot’s authorization screen.
3. HubSpot redirects back to FastAPI endpoint `/integrations/hubspot/oauth2callback` with an authorization `code` and `state`.
4. The backend validates the `state` using Redis.
5. FastAPI exchanges the code for access and refresh tokens.
6. Credentials are stored temporarily in Redis.
7. The frontend checks connection using `/credentials`.
8. Once verified, it shows **Connected to HubSpot**.
9. The frontend fetches contact data using `/get_hubspot_items`.

---

## 🧾 API Routes Overview

| Endpoint                                  | Method | Description                                 |
| ----------------------------------------- | ------ | ------------------------------------------- |
| `/integrations/hubspot/authorize`         | `POST` | Starts OAuth authorization process          |
| `/integrations/hubspot/oauth2callback`    | `GET`  | Handles HubSpot redirect and token exchange |
| `/integrations/hubspot/credentials`       | `POST` | Returns stored credentials from Redis       |
| `/integrations/hubspot/get_hubspot_items` | `POST` | Fetches contacts from HubSpot CRM API       |

---

## 🧠 Core Files Explanation

### 🗂 `main.py`

Defines FastAPI routes, CORS setup, and integrates HubSpot OAuth.

### ⚙️ `hubspot.py`

Handles the full HubSpot OAuth flow and API calls.

### 🧠 `redis_client.py`

Async Redis helper functions for storing and retrieving OAuth states and credentials.

### 💻 `hubspot.js` (Frontend)

Manages UI interactions, OAuth popup handling, and API calls to backend.

---

## 🧠 Common Issues

**CORS Error:** Allow frontend origin in CORS middleware.  
**Redis Connection Error:** Update `redis_host` if using WSL.  
**Internal Server Error:** Likely token expiry — reconnect to HubSpot.

---

## 🏁 License

This project is open-source and available under the [MIT License](LICENSE).
