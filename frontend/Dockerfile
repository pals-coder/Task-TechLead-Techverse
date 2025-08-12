FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install deps
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port for React dev server
EXPOSE 3000

# Start React app
CMD ["npm", "start"]
