FROM python:3.11.4-slim-bullseye

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libmagic-dev \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python", "main.py"]