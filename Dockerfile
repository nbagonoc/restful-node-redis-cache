# Use the official Node.js 18 image as a base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port on which your app runs
EXPOSE 5100

# Command to run your app
CMD ["npm", "start"]
