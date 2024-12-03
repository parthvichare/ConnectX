# Use the official Node.js image as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Install nodemon globally to watch for changes in development
RUN npm install -g nodemon

# Expose the port that the app runs on
EXPOSE 8000

# Command to run the Node.js application with nodemon
CMD ["nodemon", "--legacy-watch", "index.js"]
