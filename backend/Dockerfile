FROM python:3.11-slim-buster

WORKDIR /usr/src/

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PYTHONPATH /usr/src/

COPY pyproject.toml ./pyproject.toml

RUN pip install --upgrade pip
RUN pip install 'poetry==1.5.1'
RUN poetry config virtualenvs.create false
RUN poetry install

COPY . .
