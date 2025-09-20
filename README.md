# Real-Time Chat Application

A modern, scalable real-time chat application built with Next.js, Node.js, and microservices architecture. This application provides instant messaging capabilities with features like real-time communication, image sharing, typing indicators, message status tracking, and user presence.

## 🏗️ Architecture Overview

This application follows a **microservices architecture** with three distinct backend services and a modern Next.js frontend:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   User Service  │    │  Chat Service   │
│   (Next.js)     │◄──►│   (Port 4000)   │◄──►│   (Port 5002)   │
│   (Port 3000)   │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         │              ┌─────────────────┐              │
         │              │  Mail Service   │              │
         └──────────────►│   (Port 5001)   │◄─────────────┘
                        │                 │
                        └─────────────────┘
```

## 🚀 Technology Stack

### Frontend
- **Next.js 15.5.2** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling framework
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **Moment.js** - Date/time formatting
- **js-cookie** - Cookie management

### Backend Services

#### User Service (Port 4000)
- **Express.js 5.1.0** - Web framework
- **MongoDB** - Primary database
- **Redis** - Caching and session management
- **RabbitMQ** - Message queuing
- **JWT** - Authentication
- **bcrypt** - Password hashing

#### Chat Service (Port 5002)
- **Express.js 5.1.0** - Web framework
- **Socket.io 4.8.1** - Real-time communication
- **MongoDB** - Message and chat storage
- **Cloudinary** - Image storage and management
- **Multer** - File upload handling

#### Mail Service (Port 5001)
- **Express.js 5.1.0** - Web framework
- **Nodemailer** - Email sending
- **RabbitMQ** - Message queuing for async email processing

### Infrastructure
- **MongoDB** - Primary database
- **Redis** - Caching layer
- **RabbitMQ** - Message broker
- **Cloudinary** - Cloud image storage

## 📁 Project Structure

```
Real-time-chat-app/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   │   ├── chat/        # Chat interface
│   │   │   ├── login/       # Authentication
│   │   │   ├── profile/     # User profile
│   │   │   └── verify/      # Email verification
│   │   ├── components/      # Reusable UI components
│   │   │   ├── ChatMessages.tsx
│   │   │   ├── MessageInput.tsx
│   │   │   ├── chatSidebar.tsx
│   │   │   └── ...
│   │   └── context/         # React Context providers
│   │       ├── AppContext.tsx
│   │       └── SocketContext.tsx
│   └── package.json
├── backend/
│   ├── user/                # User management service
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   └── config/
│   │   └── package.json
│   ├── chat/                # Chat and messaging service
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   └── config/
│   │   └── package.json
│   └── mail/                # Email service
│       ├── src/
│       │   ├── consumer.ts
│       │   └── index.ts
│       └── package.json
└── README.md
```

## 🎯 Key Features

### Real-Time Communication
- **Instant Messaging** - Send and receive messages in real-time
- **Typing Indicators** - See when someone is typing
- **Online Status** - Track user presence and availability
- **Message Status** - Delivery and read receipts (✓ and ✓✓)

### Media Support
- **Image Sharing** - Upload and share images with Cloudinary integration
- **File Preview** - Preview images before sending
- **Caption Support** - Add text captions to images

### User Experience
- **Responsive Design** - Works on desktop and mobile devices
- **Dark Theme** - Modern dark UI with glassmorphism effects
- **Smooth Animations** - Fluid transitions and interactions
- **Toast Notifications** - User feedback for actions

### Authentication & Security
- **JWT Authentication** - Secure token-based authentication
- **Email Verification** - OTP-based email verification
- **Password Security** - Bcrypt hashing for passwords
- **Session Management** - Redis-based session storage

### Advanced Features
- **Message History** - Persistent message storage
- **Chat Management** - Create and manage multiple conversations
- **Unread Count** - Track unread messages per chat
- **Message Search** - Find messages in conversation history
- **User Management** - Add and manage contacts

## 🔧 Database Schema

### User Model
```typescript
interface IUser {
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Chat Model
```typescript
interface IChat {
  users: string[];           // Array of user IDs
  latestMessage: {
    text: string;
    sender: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Message Model
```typescript
interface IMessage {
  chatId: ObjectId;          // Reference to Chat
  sender: string;            // User ID
  text?: string;             // Text content
  image?: {
    url: string;             // Cloudinary URL
    public_id: string;       // Cloudinary public ID
  };
  messageType: "text" | "image";
  seen: boolean;             // Read status
  seenAt?: Date;             // Read timestamp
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔄 Microservices Communication

### Service Interactions

1. **User Service ↔ Frontend**
   - Authentication endpoints
   - User profile management
   - User listing for chat creation

2. **Chat Service ↔ Frontend**
   - Real-time messaging via Socket.io
   - Chat creation and management
   - Message history retrieval
   - Image upload handling

3. **User Service ↔ Mail Service**
   - RabbitMQ message queuing for email sending
   - OTP generation and delivery

4. **Chat Service ↔ User Service**
   - User validation for chat creation
   - User data retrieval for chat display

### Message Flow

```
User Action → Frontend → Backend Service → Database
     ↓
Real-time Update → Socket.io → Frontend → UI Update
     ↓
Notification → RabbitMQ → Mail Service → Email Delivery
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- Redis
- RabbitMQ
- Cloudinary account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Real-time-chat-app
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   # User Service
   cd ../backend/user
   npm install
   
   # Chat Service
   cd ../chat
   npm install
   
   # Mail Service
   cd ../mail
   npm install
   ```

4. **Environment Setup**
   
   Create `.env` files in each service directory:

   **backend/user/.env**
   ```env
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/chat-app
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=your-jwt-secret
   RABBITMQ_HOST=localhost
   RABBITMQ_PORT=5672
   RABBITMQ_USER=guest
   RABBITMQ_PASSWORD=guest
   ```

   **backend/chat/.env**
   ```env
   PORT=5002
   MONGO_URI=mongodb://localhost:27017/chat-app
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

   **backend/mail/.env**
   ```env
   PORT=5001
   RABBITMQ_HOST=localhost
   RABBITMQ_PORT=5672
   RABBITMQ_USER=guest
   RABBITMQ_PASSWORD=guest
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```

5. **Start the services**

   **Terminal 1 - User Service**
   ```bash
   cd backend/user
   npm run dev
   ```

   **Terminal 2 - Chat Service**
   ```bash
   cd backend/chat
   npm run dev
   ```

   **Terminal 3 - Mail Service**
   ```bash
   cd backend/mail
   npm run dev
   ```

   **Terminal 4 - Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - User Service API: http://localhost:4000
   - Chat Service API: http://localhost:5002
   - Mail Service: http://localhost:5001

## 📡 API Endpoints

### User Service (Port 4000)

#### Authentication
- `POST /api/v1/register` - User registration
- `POST /api/v1/login` - User login
- `POST /api/v1/verify-otp` - Email verification
- `GET /api/v1/me` - Get current user
- `GET /api/v1/user/all` - Get all users

### Chat Service (Port 5002)

#### Chat Management
- `GET /api/v1/chat/all` - Get user's chats
- `POST /api/v1/chat/new` - Create new chat
- `GET /api/v1/message/:chatId` - Get chat messages
- `POST /api/v1/message` - Send message

#### Socket.io Events
- `connection` - User connects
- `joinChat` - Join a chat room
- `leaveChat` - Leave a chat room
- `typing` - User is typing
- `stopTyping` - User stopped typing
- `newMessage` - New message received
- `messagesSeen` - Message read status

## 🎨 Frontend Components

### Core Components

#### AppContext
- Global state management
- User authentication state
- Chat data management
- API service integration

#### SocketContext
- Socket.io connection management
- Real-time event handling
- Online user tracking

#### ChatMessages
- Message display and rendering
- Message status indicators
- Scroll management
- Image message support

#### MessageInput
- Text input with typing indicators
- Image upload functionality
- File preview and management
- Send button with loading states

#### ChatSidebar
- User list and chat history
- Online status indicators
- Chat creation interface
- User search and filtering

## 🔒 Security Features

- **JWT Token Authentication** - Secure API access
- **Password Hashing** - Bcrypt for password security
- **CORS Protection** - Cross-origin request security
- **Input Validation** - Server-side validation
- **File Upload Security** - Image type validation
- **Session Management** - Redis-based sessions

## 🚀 Deployment

### Production Environment Variables

Ensure all services have proper production environment variables:

- Database connection strings
- Redis configuration
- RabbitMQ credentials
- Cloudinary API keys
- JWT secrets
- Email service credentials

### Docker Deployment (Optional)

Create Dockerfiles for each service and use docker-compose for orchestration.

## 🧪 Testing

The application includes comprehensive error handling and validation:

- API endpoint testing
- Socket.io event testing
- Frontend component testing
- Integration testing between services

## 📈 Performance Optimizations

- **Redis Caching** - Fast data retrieval
- **Message Queuing** - Asynchronous processing
- **Image Optimization** - Cloudinary integration
- **Socket.io Rooms** - Efficient real-time communication
- **React Context** - Optimized state management
- **Lazy Loading** - Component-based code splitting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

---

**Built with ❤️ using Next.js, Node.js, and modern web technologies**
