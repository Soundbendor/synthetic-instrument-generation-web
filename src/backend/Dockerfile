FROM python:3.9-slim-buster

WORKDIR /app

COPY . .

RUN pip install --no-cache-dir -r ./requirements.txt
RUN pip install python-dotenv

ENV MYSQL_HOST=sigdb.cmnz4advdpzd.us-west-2.rds.amazonaws.com
ENV MYSQL_USER=admin
ENV MYSQL_PASS=Beaver!1
ENV MYSQL_DB=sig

EXPOSE 5000

CMD ["python", "api.py"]
