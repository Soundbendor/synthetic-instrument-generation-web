# Running locally

## Frontend:
Run the command to install dependencies.

``` npm install ```

## API:
Run this command to install Flask and other dependencies for the API.

``` pip install -r requirements.txt ```


From the backend folder start the api server.

``` python api.py ```

As of now the website is laid out so that index.js, creates the main page found within Sig.js. All componenets can be found within ```./src/pages/components ```, and the backend can be found within ```./src/backend```.

# Running on AWS
First you must ensure that you have configured your credentials for your AWS account. This can be done manually by placing them within ```C:/Users/<Your_User>/.aws/credentials```.

## S3
First we must build the React project using

```npm run build```

once the project is built you can simply just upload this into the S3 bucket named ```sig-bucket```.

## Lightsail
We containerize the backend using docker and push the latest image to the AWS lightsail service with the following commands from the backend folder.

```docker build -t sig-api .```

```aws lightsail push-container-image --service-name sig-api --label sig-api --image sig-api```
