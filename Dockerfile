# ==============================================================================
# AI-PathFinder Production Container (Universal Cloud Deployment)
# Multi-stage build: React 19 Frontend + FastAPI Python 3.11 Backend
# Compatible with: Hugging Face Spaces (Port 7860, UID 1000), Render, Railway
# ==============================================================================

# --- Stage 1: Build React Frontend ---
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# --- Stage 2: Production Python ASGI Runtime ---
FROM python:3.11-slim
WORKDIR /app/backend

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=7860

# Install runtime system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application source code
COPY backend/ .

# Copy compiled frontend assets into backend/static for unified single-port serving
COPY --from=frontend-builder /app/frontend/dist ./static

# Configure non-root user (Hugging Face Spaces UID 1000 compliance)
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app && \
    chmod -R 777 /app

USER appuser

EXPOSE 7860

# Launch FastAPI ASGI server with dynamic port resolution
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-7860}"]
