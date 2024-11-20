FROM node:18-alpine

LABEL NAME=FXQL Version=1.0

# Set working directory to the root of the container
WORKDIR /

# Copy package.json and package-lock.json
COPY ["package.json", "package-lock.json", "./"]

# Copy the .env file into the container
# COPY .env .env

# Install dependencies globally and locally
RUN npm install -g prisma
RUN npm ci 

# Copy Prisma schema and other app files
COPY prisma/ /prisma/
COPY . /

# Expose port 8080
EXPOSE 8080
ENV PORT=8080

# Generate Prisma client
RUN npm run prisma:generate

# Ensure the .env file is properly used during migrations and build
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]