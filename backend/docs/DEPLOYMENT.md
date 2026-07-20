# Deployment Guide

This document outlines how to deploy the MergeMind backend to a production environment.

## 1. Render Deployment (Recommended)

We recommend using Render for hosting the backend via Docker.

### Steps:
1. Push your code to a GitHub repository.
2. In the Render Dashboard, create a new **Web Service**.
3. Connect your GitHub repository.
4. Set the Environment to **Docker**.
5. Set the Region closest to your users.
6. Under **Advanced**, add the necessary Environment Variables (see ENVIRONMENT.md).
7. Click **Deploy**. Render will automatically build the `Dockerfile` and start the cluster via `npm start`.

## 2. Docker Deployment (Self-Hosted)

If deploying to your own VPS (e.g., AWS EC2, DigitalOcean):

1. Clone the repository to your server.
2. Ensure Docker and Docker Compose are installed.
3. Create a `.env` file in the `backend` directory matching the production variables.
4. Run the production compose file:
   `docker compose -f docker-compose.prod.yml up -d --build`

## 3. High Availability & Clustering
The MergeMind backend automatically scales to the number of available CPU cores. It utilizes `WEB_CONCURRENCY` (provided natively by platforms like Render) or falls back to `os.cpus().length`. No code changes are required when upgrading hardware.
