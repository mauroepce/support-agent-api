# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the web app source code
COPY ./src ./src
COPY .env ./


# Expose the port on which the app will run
EXPOSE 3000

# Defining the command to run 
CMD [ "npm", "run", "start" ]
