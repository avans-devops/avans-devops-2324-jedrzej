FROM node:16

WORKDIR /app
COPY . . 
RUN npm install
EXPOSE 3000
COPY wait-for-it.sh .
CMD ["./wait-for-it.sh", "rb:5672", "--", "npm", "start"]
