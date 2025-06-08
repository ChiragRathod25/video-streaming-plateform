FROM node:23-alpine3.19

WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache and avoid reinstalling dependencies on every change
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .  

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm","run", "start"]