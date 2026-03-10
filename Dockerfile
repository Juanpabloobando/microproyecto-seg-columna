# ── Stage 1: Build frontend ──
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY src/frontend/package.json src/frontend/package-lock.json ./
RUN npm ci
COPY src/frontend/ ./
RUN npm run build

# ── Stage 2: Python backend + static frontend ──
FROM python:3.11-slim
WORKDIR /app

# Install Python dependencies
COPY src/backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY src/backend/ ./

# Copy dataset
COPY data/student_depression.csv /app/data/student_depression.csv

# Copy built frontend into backend/static
COPY --from=frontend-build /app/frontend/dist ./static/

# Expose port
EXPOSE 8000

# Start server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
