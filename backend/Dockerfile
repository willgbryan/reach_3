FROM python:3.11.4-slim-bullseye

# system dependencies... most of these are for unstructured
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
    poppler-utils \
    tesseract-ocr \
    tesseract-ocr-all \
    libreoffice \
    && rm -rf /var/lib/apt/lists/*

RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

RUN curl -s https://api.github.com/repos/jgm/pandoc/releases/latest \
    | grep "browser_download_url.*deb" \
    | cut -d : -f 2,3 \
    | tr -d \" \
    | wget -qi - \
    && dpkg -i pandoc-*.deb \
    && rm pandoc-*.deb

WORKDIR /usr/src/app

COPY requirements.txt .

ENV LIBCLANG_PATH="/usr/lib/llvm-11/lib"

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir setuptools wheel && \
    pip install --no-cache-dir simsimd==3.7.7 && \
    pip install --no-cache-dir -r requirements.txt && \
    # handling unstrucuted install here as its much more expansive than a trad package
    pip install --no-cache-dir "unstructured[all-docs]" && \
    pipdeptree --warn silence | grep -i "CONFLICT" > dependency_conflicts.txt || true

COPY . .

EXPOSE 8000

CMD ["python", "main.py"]