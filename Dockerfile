# dockerfile
FROM node:20-alpine

# working directory
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

# cp app files
COPY . .

# nuild the app
RUN npm run build

# expose port
EXPOSE 3000

# start 
CMD ["npm", "start"]
