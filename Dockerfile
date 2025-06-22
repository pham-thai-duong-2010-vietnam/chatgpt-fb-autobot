FROM python:3.10-slim

# Cài Chrome và Node.js
RUN apt-get update && apt-get install -y \
    wget unzip curl gnupg xvfb nodejs npm \
    libxi6 libgconf-2-4 libnss3 libxss1 libasound2 libatk-bridge2.0-0 libgtk-3-0 libx11-xcb1 \
 && curl -sSL https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb -o chrome.deb \
 && apt install -y ./chrome.deb \
 && npm install -g npm && npm install facebook-chat-api

# Copy source code
WORKDIR /app
COPY . /app

# Cài thư viện Python
RUN pip install -r requirements.txt

# Chạy script chính
CMD ["bash", "start.sh"]
