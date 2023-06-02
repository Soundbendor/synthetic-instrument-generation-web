# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies
RUN npm install --production --force

# Copy the rest of the application files to the container
COPY . .

# Expose port 3000 for the application
EXPOSE 3000

ENV API_URL=https://sig-api.9s7d9oh6r2mg0.us-east-1.cs.amazonlightsail.com/

ENV IP_API_KEY=abe1a825ca4c4a7b83a74c4486f4ace1

# Start the application
CMD [ "npm", "start" ]
