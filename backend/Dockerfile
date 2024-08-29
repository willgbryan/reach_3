FROM python:3.11.4-slim-bullseye

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libmagic-dev \
    git \
    curl \
    cmake \
    ffmpeg \
    libsm6 \
    libxext6 \
    libclang-dev \
    clang \
    && rm -rf /var/lib/apt/lists/*

RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

WORKDIR /usr/src/app

COPY requirements.txt .
ENV LIBCLANG_PATH="/usr/lib/llvm-11/lib"

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir setuptools wheel && \
    pip install --no-cache-dir simsimd==3.7.7 && \
    pip install --no-cache-dir -r requirements.txt && \
    pipdeptree --warn silence | grep -i "CONFLICT" > dependency_conflicts.txt || true

COPY . .

EXPOSE 8000

CMD ["python", "main.py"]