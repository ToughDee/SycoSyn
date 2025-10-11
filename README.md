# 🧰 Project Setup Guide

This guide helps new developers quickly set up and run the project locally with **MongoDB**, **Elasticsearch (Docker)**, and **Node.js backend**.

---

## ⚙️ Prerequisites
Make sure you have the following installed:
- **Node.js** (v18 or above)
- **npm** (comes with Node)
- **Docker**  
  👉 [Install Docker](https://docs.docker.com/get-docker/)

---

## 🐳 Step 1: Start Elasticsearch with Docker
Run the following command to start Elasticsearch in a Docker container:

```bash
docker run -d   --name elasticsearch   -p 9200:9200   -e "discovery.type=single-node"   -e "ES_JAVA_OPTS=-Xms512m -Xmx512m"   -e "xpack.security.enabled=false"   docker.elastic.co/elasticsearch/elasticsearch:8.12.2
```

> 🧠 Tip: Check if it’s running by visiting [http://localhost:9200](http://localhost:9200)

Expected output should show:
```json
{
  "name": "elasticsearch",
  "cluster_name": "docker-cluster",
  ...
}
```

---

## 🧩 Step 2: Environment Variables
Create a `.env` file in your project root with the following values:

```bash
ELASTICSEARCH_NODE=http://localhost:9200

ACCESS_TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret

PROD=development
PORT=8000
```


---

## 📦 Step 3: Install Dependencies
Install all npm packages:

```bash
npm install
```

---

## 🔁 Step 4: Reindex Existing Data
Before starting the backend, you need to **populate Elasticsearch** with your existing MongoDB data.

Run:

```bash
node scripts/reindex.js
```

This will:
- Connect to MongoDB  
- Create the `arts` index (if missing)  
- Sync all `Art` documents to Elasticsearch  

✅ You should see:
```
✅ Connected to MongoDB
✅ 'arts' index created with proper mapping
✅ Successfully indexed X arts
```

---

## 🚀 Step 5: Start the Backend Server
Finally, start the backend:

```bash
npm run dev
```

The server should now be running at:

```
http://localhost:8000
```

---

## 🧠 Optional: Useful Docker Commands

| Command | Description |
|----------|-------------|
| `docker ps` | Show running containers |
| `docker stop elasticsearch` | Stop the ES container |
| `docker start elasticsearch` | Restart the ES container |
| `docker rm -f elasticsearch` | Delete the ES container |
| `docker logs -f elasticsearch` | View live ES logs |

---

## ✅ Quick Recap
| Step | Command | Purpose |
|------|----------|----------|
| 1️⃣ | `docker run …` | Start Elasticsearch |
| 2️⃣ | Create `.env` | Set config values |
| 3️⃣ | `npm install` | Install dependencies |
| 4️⃣ | `npm run reindex` | Populate Elasticsearch |
| 5️⃣ | `npm run dev` | Start backend |
