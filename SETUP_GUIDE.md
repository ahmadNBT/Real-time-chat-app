# Setup and Installation Guide

## Prerequisites

Before setting up the Real-Time Chat Application, ensure you have the following installed on your system:

### Required Software
- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v5.0 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Redis** (v6.0 or higher) - [Download here](https://redis.io/download)
- **RabbitMQ** (v3.8 or higher) - [Download here](https://www.rabbitmq.com/download.html)

### Optional but Recommended
- **Git** - [Download here](https://git-scm.com/)
- **VS Code** - [Download here](https://code.visualstudio.com/)
- **MongoDB Compass** - [Download here](https://www.mongodb.com/products/compass)
- **RedisInsight** - [Download here](https://redislabs.com/redis-enterprise/redis-insight/)

## Quick Start (5 Minutes)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Real-time-chat-app
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend/user
npm install

cd ../chat
npm install

cd ../mail
npm install
```

### 3. Start Required Services
```bash
# Terminal 1 - Start MongoDB
mongod

# Terminal 2 - Start Redis
redis-server

# Terminal 3 - Start RabbitMQ
rabbitmq-server
```

### 4. Configure Environment Variables
Create `.env` files in each service directory with the provided templates.

### 5. Start the Application
```bash
# Terminal 4 - User Service
cd backend/user
npm run dev

# Terminal 5 - Chat Service
cd backend/chat
npm run dev

# Terminal 6 - Mail Service
cd backend/mail
npm run dev

# Terminal 7 - Frontend
cd frontend
npm run dev
```

### 6. Access the Application
Open your browser and navigate to `http://localhost:3000`

---

## Detailed Setup Instructions

### Step 1: System Requirements Check

#### Check Node.js Installation
```bash
node --version
npm --version
```
Expected output: Node.js v18+ and npm v8+

#### Check MongoDB Installation
```bash
mongod --version
mongo --version
```
Expected output: MongoDB v5.0+

#### Check Redis Installation
```bash
redis-server --version
redis-cli --version
```
Expected output: Redis v6.0+

#### Check RabbitMQ Installation
```bash
rabbitmq-server --version
```
Expected output: RabbitMQ v3.8+

### Step 2: Database Setup

#### MongoDB Configuration
1. **Start MongoDB Service**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

2. **Create Database and User** (Optional)
   ```bash
   mongo
   use chat-app
   db.createUser({
     user: "chatuser",
     pwd: "chatpassword",
     roles: ["readWrite"]
   })
   ```

#### Redis Configuration
1. **Start Redis Service**
   ```bash
   # Windows
   redis-server
   
   # macOS/Linux
   sudo systemctl start redis
   ```

2. **Test Redis Connection**
   ```bash
   redis-cli ping
   ```
   Expected output: `PONG`

#### RabbitMQ Configuration
1. **Start RabbitMQ Service**
   ```bash
   # Windows
   rabbitmq-server
   
   # macOS/Linux
   sudo systemctl start rabbitmq-server
   ```

2. **Enable Management Plugin**
   ```bash
   rabbitmq-plugins enable rabbitmq_management
   ```

3. **Access Management UI**
   Open `http://localhost:15672` in your browser
   - Username: `guest`
   - Password: `guest`

### Step 3: Environment Configuration

#### User Service Environment (.env)
Create `backend/user/.env`:
```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/chat-app

# Redis Configuration
REDIS_URL=redis://localhost:6379

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# RabbitMQ Configuration
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USER=guest
RABBITMQ_PASSWORD=guest

# Email Configuration (for OTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

#### Chat Service Environment (.env)
Create `backend/chat/.env`:
```env
# Server Configuration
PORT=5002
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/chat-app

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

#### Mail Service Environment (.env)
Create `backend/mail/.env`:
```env
# Server Configuration
PORT=5001
NODE_ENV=development

# RabbitMQ Configuration
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USER=guest
RABBITMQ_PASSWORD=guest

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

### Step 4: Cloudinary Setup (For Image Storage)

1. **Create Cloudinary Account**
   - Visit [cloudinary.com](https://cloudinary.com)
   - Sign up for a free account

2. **Get API Credentials**
   - Go to Dashboard
   - Copy Cloud Name, API Key, and API Secret

3. **Update Chat Service .env**
   ```env
   CLOUDINARY_CLOUD_NAME=your-actual-cloud-name
   CLOUDINARY_API_KEY=your-actual-api-key
   CLOUDINARY_API_SECRET=your-actual-api-secret
   ```

### Step 5: Gmail SMTP Setup (For Email Verification)

1. **Enable 2-Factor Authentication**
   - Go to Google Account settings
   - Enable 2FA for your Gmail account

2. **Generate App Password**
   - Go to Security settings
   - Generate an app-specific password
   - Use this password in your .env files

3. **Update Email Configuration**
   ```env
   EMAIL_USER=your-actual-email@gmail.com
   EMAIL_PASSWORD=your-generated-app-password
   ```

### Step 6: Start the Application

#### Development Mode (Recommended)
```bash
# Terminal 1 - User Service
cd backend/user
npm run dev

# Terminal 2 - Chat Service
cd backend/chat
npm run dev

# Terminal 3 - Mail Service
cd backend/mail
npm run dev

# Terminal 4 - Frontend
cd frontend
npm run dev
```

#### Production Mode
```bash
# Build all services
cd backend/user && npm run build
cd ../chat && npm run build
cd ../mail && npm run build
cd ../../frontend && npm run build

# Start all services
cd backend/user && npm start
cd ../chat && npm start
cd ../mail && npm start
cd ../../frontend && npm start
```

### Step 7: Verify Installation

#### Check Service Health
```bash
# User Service
curl http://localhost:4000/health

# Chat Service
curl http://localhost:5002/health

# Mail Service
curl http://localhost:5001/health
```

#### Test Database Connections
```bash
# MongoDB
mongo --eval "db.runCommand({connectionStatus: 1})"

# Redis
redis-cli ping

# RabbitMQ
rabbitmqctl status
```

#### Access the Application
1. Open browser to `http://localhost:3000`
2. Register a new account
3. Verify email with OTP
4. Login and start chatting

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Port Already in Use
```bash
# Find process using port
netstat -ano | findstr :4000

# Kill process (Windows)
taskkill /PID <process_id> /F

# Kill process (macOS/Linux)
kill -9 <process_id>
```

#### 2. MongoDB Connection Failed
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB service
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

#### 3. Redis Connection Failed
```bash
# Check Redis status
redis-cli ping

# Start Redis service
# Windows
redis-server

# macOS/Linux
sudo systemctl start redis
```

#### 4. RabbitMQ Connection Failed
```bash
# Check RabbitMQ status
rabbitmqctl status

# Start RabbitMQ service
# Windows
rabbitmq-server

# macOS/Linux
sudo systemctl start rabbitmq-server
```

#### 5. Environment Variables Not Loading
- Ensure `.env` files are in the correct directories
- Check for typos in variable names
- Restart the services after changing .env files

#### 6. Cloudinary Upload Failed
- Verify API credentials in `.env`
- Check Cloudinary account status
- Ensure image file types are supported

#### 7. Email Not Sending
- Verify Gmail app password
- Check 2FA is enabled
- Ensure SMTP settings are correct

### Debug Mode

#### Enable Debug Logging
```bash
# Set debug environment variable
export DEBUG=*
# or
set DEBUG=*
```

#### Check Service Logs
```bash
# User Service logs
cd backend/user
npm run dev 2>&1 | tee user-service.log

# Chat Service logs
cd backend/chat
npm run dev 2>&1 | tee chat-service.log

# Mail Service logs
cd backend/mail
npm run dev 2>&1 | tee mail-service.log
```

---

## Docker Setup (Alternative)

### Using Docker Compose

1. **Create docker-compose.yml**
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:5.0
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: chat-app

  redis:
    image: redis:6.0
    ports:
      - "6379:6379"

  rabbitmq:
    image: rabbitmq:3.8-management
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: guest
      RABBITMQ_DEFAULT_PASS: guest

  user-service:
    build: ./backend/user
    ports:
      - "4000:4000"
    environment:
      - MONGO_URI=mongodb://mongodb:27017/chat-app
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongodb
      - redis

  chat-service:
    build: ./backend/chat
    ports:
      - "5002:5002"
    environment:
      - MONGO_URI=mongodb://mongodb:27017/chat-app
    depends_on:
      - mongodb

  mail-service:
    build: ./backend/mail
    ports:
      - "5001:5001"
    depends_on:
      - rabbitmq

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - user-service
      - chat-service
```

2. **Start with Docker Compose**
```bash
docker-compose up -d
```

---

## Performance Optimization

### Production Recommendations

1. **Use PM2 for Process Management**
```bash
npm install -g pm2

# Start services with PM2
pm2 start backend/user/dist/index.js --name user-service
pm2 start backend/chat/dist/index.js --name chat-service
pm2 start backend/mail/dist/index.js --name mail-service
```

2. **Enable Gzip Compression**
```javascript
// In Express.js apps
app.use(compression());
```

3. **Use Redis for Session Storage**
```javascript
// Configure Redis for sessions
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
```

4. **Database Indexing**
```javascript
// Create indexes for better performance
db.messages.createIndex({ chatId: 1, createdAt: -1 });
db.chats.createIndex({ users: 1 });
db.users.createIndex({ email: 1 });
```

---

## Security Checklist

### Before Going to Production

- [ ] Change all default passwords
- [ ] Use strong JWT secrets
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable input validation
- [ ] Use environment variables for secrets
- [ ] Set up monitoring and logging
- [ ] Configure firewall rules
- [ ] Regular security updates

---

## Support and Maintenance

### Regular Maintenance Tasks

1. **Database Backup**
```bash
# MongoDB backup
mongodump --db chat-app --out backup/

# Redis backup
redis-cli BGSAVE
```

2. **Log Rotation**
```bash
# Configure logrotate for service logs
sudo nano /etc/logrotate.d/chat-app
```

3. **Performance Monitoring**
- Monitor CPU and memory usage
- Check database performance
- Monitor queue processing
- Track error rates

### Getting Help

- Check the troubleshooting section above
- Review service logs for errors
- Verify all dependencies are installed
- Ensure all services are running
- Check network connectivity between services

---

This setup guide provides comprehensive instructions for getting the Real-Time Chat Application up and running in both development and production environments.
