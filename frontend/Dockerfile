# Use the official Node.js runtime as the base image
FROM node:alpine as build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application code to the container
COPY . .

# Convert args to environment variables for the build
ARG FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID
ARG FIREBASE_API_KEY
ENV VITE_FIREBASE_API_KEY=$FIREBASE_API_KEY
ARG FIREBASE_AUTH_DOMAIN
ENV VITE_FIREBASE_AUTH_DOMAIN=$FIREBASE_AUTH_DOMAIN
ARG FIREBASE_STORAGE_BUCKET
ENV VITE_FIREBASE_STORAGE_BUCKET=$FIREBASE_STORAGE_BUCKET
ARG FIREBASE_MESSAGING_SENDER_ID
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=$FIREBASE_MESSAGING_SENDER_ID
ARG FIREBASE_APP_ID
ENV VITE_FIREBASE_APP_ID=$FIREBASE_APP_ID
ARG REF_NAME
ENV VITE_REF_NAME=$REF_NAME
ARG VITE_ABLY_API_KEY
ENV VITE_ABLY_API_KEY=$ABLY_API_KEY
# Optional local development args
ARG FIREBASE_AUTH_EMULATOR_HOST
ENV VITE_FIREBASE_AUTH_EMULATOR_HOST=$FIREBASE_AUTH_EMULATOR_HOST

# Build the React app for production
RUN npm run build

# Use Nginx as the production server
FROM nginx:alpine as runner

# Copy the Nginx configuration file to the container
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built React app to Nginx's web server directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 5173 for the Nginx server
EXPOSE 5173

# Start Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]