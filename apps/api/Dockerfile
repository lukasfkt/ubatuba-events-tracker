FROM python:3.12.10-slim

# set working directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# install system dependencies
RUN apt-get update \
  && apt-get install -y gcc libpq-dev postgresql-client \
  && apt-get clean

# install python dependencies
COPY ./requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# copy source code
COPY . .

# expose API port
EXPOSE 8000

# run migrations and start the server
CMD alembic upgrade head && uvicorn src.main:app --host 0.0.0.0 --port 8000
