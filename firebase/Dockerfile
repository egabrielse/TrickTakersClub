FROM node:alpine

# Set the working directory in the container 
WORKDIR /app

# Copy over files from firebase project directory to the container
COPY . /app

# Install pesky JDK
RUN apk add openjdk11

# Install the firebase cli
RUN npm install -g firebase-tools

# Install and setup all the Firebase emulators
RUN firebase setup:emulators:database
RUN firebase setup:emulators:ui       

# Expose the emulator ports
# These must match the ports in the firebase.json file
#       AUTH  STORE  UI   emulator ports
EXPOSE  9099  8088   4000

# Start the emulator
CMD ["firebase", "emulators:start", "--project=demo-tricktakersclub", "--import=./data", "--export-on-exit"]
