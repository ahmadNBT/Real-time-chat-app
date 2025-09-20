# API Documentation

## Overview

This document provides comprehensive API documentation for the Real-Time Chat Application's microservices architecture. The application consists of three backend services: User Service, Chat Service, and Mail Service.

## Base URLs

- **User Service**: `http://localhost:4000`
- **Chat Service**: `http://localhost:5002`
- **Mail Service**: `http://localhost:5001`

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## User Service API (Port 4000)

### Authentication Endpoints

#### Register User
```http
POST /api/v1/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully. Please verify your email.",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login User
```http
POST /api/v1/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Verify OTP
```http
POST /api/v1/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

### User Management Endpoints

#### Get Current User
```http
GET /api/v1/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Get All Users
```http
GET /api/v1/user/all
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "_id": "user_id_1",
      "name": "John Doe",
      "email": "john@example.com"
    },
    {
      "_id": "user_id_2",
      "name": "Jane Smith",
      "email": "jane@example.com"
    }
  ]
}
```

---

## Chat Service API (Port 5002)

### Chat Management Endpoints

#### Get All Chats
```http
GET /api/v1/chat/all
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "chats": [
    {
      "_id": "chat_id",
      "user": {
        "_id": "user_id",
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "chat": {
        "_id": "chat_id",
        "users": ["current_user_id", "other_user_id"],
        "latestMessage": {
          "text": "Hello there!",
          "sender": "other_user_id"
        },
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "unseenCount": 2
      }
    }
  ]
}
```

#### Create New Chat
```http
POST /api/v1/chat/new
Authorization: Bearer <token>
Content-Type: application/json

{
  "otherUserId": "other_user_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Chat created successfully",
  "chatId": "new_chat_id"
}
```

### Message Endpoints

#### Get Chat Messages
```http
GET /api/v1/message/:chatId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "messages": [
    {
      "_id": "message_id",
      "chatId": "chat_id",
      "sender": "user_id",
      "text": "Hello there!",
      "messageType": "text",
      "seen": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "user": {
    "_id": "other_user_id",
    "name": "Jane Smith",
    "email": "jane@example.com"
  }
}
```

#### Send Message
```http
POST /api/v1/message
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "chatId": "chat_id",
  "text": "Hello there!",
  "image": <file> // Optional image file
}
```

**Response:**
```json
{
  "success": true,
  "message": {
    "_id": "message_id",
    "chatId": "chat_id",
    "sender": "user_id",
    "text": "Hello there!",
    "messageType": "text",
    "seen": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "sender": "user_id"
}
```

---

## Socket.io Events (Chat Service)

### Connection Events

#### User Connection
```javascript
// Client connects with user ID
const socket = io('http://localhost:5002', {
  query: {
    userId: 'user_id'
  }
});
```

#### Join Chat Room
```javascript
// Join a specific chat
socket.emit('joinChat', 'chat_id');
```

#### Leave Chat Room
```javascript
// Leave a chat room
socket.emit('leaveChat', 'chat_id');
```

### Typing Events

#### User Typing
```javascript
// Emit when user starts typing
socket.emit('typing', {
  userId: 'user_id',
  chatId: 'chat_id'
});
```

#### Stop Typing
```javascript
// Emit when user stops typing
socket.emit('stopTyping', {
  userId: 'user_id',
  chatId: 'chat_id'
});
```

### Message Events

#### New Message Received
```javascript
// Listen for new messages
socket.on('newMessage', (message) => {
  console.log('New message:', message);
  // Handle new message in UI
});
```

#### Messages Seen
```javascript
// Listen for message read status
socket.on('messagesSeen', (data) => {
  console.log('Messages seen:', data);
  // Update message status in UI
});
```

#### User Typing Indicator
```javascript
// Listen for typing indicators
socket.on('userTyping', (data) => {
  console.log('User typing:', data);
  // Show typing indicator
});

socket.on('userStoppedTyping', (data) => {
  console.log('User stopped typing:', data);
  // Hide typing indicator
});
```

#### Online Users
```javascript
// Listen for online users list
socket.on('getOnlineUser', (users) => {
  console.log('Online users:', users);
  // Update online status in UI
});
```

---

## Error Responses

### Standard Error Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

### Error Examples

#### Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "email": "Email is required",
    "password": "Password must be at least 6 characters"
  }
}
```

#### Authentication Error
```json
{
  "success": false,
  "message": "Invalid token",
  "error": "Token expired or invalid"
}
```

#### Not Found Error
```json
{
  "success": false,
  "message": "Chat not found",
  "error": "No chat found with the provided ID"
}
```

---

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Authentication endpoints**: 5 requests per minute per IP
- **Message endpoints**: 60 requests per minute per user
- **General endpoints**: 100 requests per minute per IP

---

## Webhook Events

### Mail Service Events

The Mail Service processes email-related events through RabbitMQ:

#### Send OTP Email
```json
{
  "to": "user@example.com",
  "subject": "Verify Your Email - Chat App",
  "text": "Your OTP is: 123456"
}
```

---

## Testing the API

### Using cURL

#### Register User
```bash
curl -X POST http://localhost:4000/api/v1/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Login User
```bash
curl -X POST http://localhost:4000/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Get User Chats
```bash
curl -X GET http://localhost:5002/api/v1/chat/all \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman

1. Import the API collection
2. Set up environment variables for base URLs
3. Configure authentication headers
4. Test all endpoints systematically

---

## SDK Examples

### JavaScript/TypeScript

```typescript
// User Service API Client
class UserServiceAPI {
  private baseURL = 'http://localhost:4000';
  private token: string | null = null;

  async login(email: string, password: string) {
    const response = await fetch(`${this.baseURL}/api/v1/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    if (data.success) {
      this.token = data.token;
    }
    return data;
  }

  async getCurrentUser() {
    const response = await fetch(`${this.baseURL}/api/v1/me`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    return response.json();
  }
}

// Chat Service API Client
class ChatServiceAPI {
  private baseURL = 'http://localhost:5002';
  private token: string | null = null;

  async sendMessage(chatId: string, text: string, image?: File) {
    const formData = new FormData();
    formData.append('chatId', chatId);
    formData.append('text', text);
    if (image) formData.append('image', image);

    const response = await fetch(`${this.baseURL}/api/v1/message`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.token}` },
      body: formData
    });
    
    return response.json();
  }
}
```

---

## Monitoring and Logging

### Health Check Endpoints

- **User Service**: `GET /health`
- **Chat Service**: `GET /health`
- **Mail Service**: `GET /health`

### Logging

All services implement structured logging with:
- Request/response logging
- Error tracking
- Performance metrics
- User activity logs

---

This API documentation provides comprehensive coverage of all endpoints, events, and integration patterns for the Real-Time Chat Application.
