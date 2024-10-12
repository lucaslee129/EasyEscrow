FROM python:3.9-slim-buster

RUN apt-get update

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "create_escrow.py"]