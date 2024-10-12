FROM python:3.9-slim-buster

RUN apt-get update

ENV SERVER_PATH /backend
RUN mkdir -p $SERVER_PATH

WORKDIR $SERVER_PATH

COPY requirements.txt backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

COPY . .

CMD python backend/app.py
