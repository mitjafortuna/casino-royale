FROM node:12.14.0-slim
# Set the working directory to /dist
WORKDIR /dist
# copy package.json into the container at /dist
COPY package*.json /dist/
# install dependencies
RUN npm install
RUN npm install -g typescript
# Copy the current directory contents into the container at /dist
COPY . /dist/

#Compile typescript
RUN npm run build-prod

# Default env file
ENV ENV_FILE=.env
# Make port 4000 available to the world outside this container
EXPOSE 4000
# Run the app when the container launches
CMD [ "node", "-r", "./dist/app.js" ]
