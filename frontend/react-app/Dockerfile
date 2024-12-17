# Use Node.js for the React app
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Install telnet
RUN apk add --no-cache busybox-extras

# Expose the default port for React
EXPOSE 3000

# Start the React app with live reloading
CMD ["npm", "start"]
