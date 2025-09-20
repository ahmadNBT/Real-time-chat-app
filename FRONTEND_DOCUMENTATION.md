# Frontend Documentation

## Overview

The frontend of the Real-Time Chat Application is built with **Next.js 15.5.2** using the App Router architecture. It provides a modern, responsive user interface with real-time messaging capabilities, user management, and seamless integration with the backend microservices.

## Technology Stack

- **Next.js 15.5.2** - React framework with App Router
- **React 19.1.0** - UI library with latest features
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS 4** - Utility-first CSS framework
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library
- **Moment.js** - Date/time formatting
- **js-cookie** - Cookie management

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout component
│   │   ├── page.tsx           # Home page (redirects to chat)
│   │   ├── chat/              # Chat interface
│   │   │   └── page.tsx       # Main chat page
│   │   ├── login/             # Authentication
│   │   │   └── page.tsx       # Login page
│   │   ├── profile/           # User profile
│   │   │   └── page.tsx       # Profile management
│   │   └── verify/            # Email verification
│   │       └── page.tsx       # OTP verification
│   ├── components/            # Reusable UI components
│   │   ├── ChatMessages.tsx   # Message display component
│   │   ├── MessageInput.tsx   # Message input component
│   │   ├── chatSidebar.tsx    # Chat sidebar component
│   │   ├── chatHeader.tsx     # Chat header component
│   │   ├── Loading.tsx        # Loading component
│   │   └── VerifyOTP.tsx      # OTP verification component
│   └── context/               # React Context providers
│       ├── AppContext.tsx     # Global app state
│       └── SocketContext.tsx  # Socket.io context
├── public/                    # Static assets
├── package.json              # Dependencies and scripts
├── next.config.ts            # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

## Core Components

### 1. AppContext (Global State Management)

**File**: `src/context/AppContext.tsx`

**Purpose**: Manages global application state including user authentication, chat data, and API service configuration.

**Key Features**:
- User authentication state management
- Chat data fetching and caching
- User list management
- API service endpoints configuration
- Toast notifications integration

**State Properties**:
```typescript
interface AppContextType {
  user: User | null;                    // Current logged-in user
  loading: boolean;                     // Loading state
  isAuth: boolean;                      // Authentication status
  chats: Chats[] | null;               // User's chat list
  users: User[] | null;                // All users list
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  logoutUser: () => Promise<void>;     // Logout function
  fetchUser: () => Promise<void>;      // Fetch current user
  fetchChats: () => Promise<void>;     // Fetch user's chats
  setChats: React.Dispatch<React.SetStateAction<Chats[] | null>>;
}
```

**API Service Configuration**:
```typescript
export const user_service = "http://localhost:5000";
export const chat_service = "http://localhost:5002";
```

### 2. SocketContext (Real-time Communication)

**File**: `src/context/SocketContext.tsx`

**Purpose**: Manages Socket.io connection and real-time events for instant messaging.

**Key Features**:
- Socket.io connection management
- Online users tracking
- Real-time event handling
- Connection lifecycle management

**State Properties**:
```typescript
interface SocketContextType {
  socket: Socket | null;               // Socket.io instance
  onlineUsers: string[];               // Array of online user IDs
}
```

**Socket Events**:
- `connection` - User connects to server
- `getOnlineUser` - Receives list of online users
- `newMessage` - New message received
- `messagesSeen` - Message read status update
- `userTyping` - User typing indicator
- `userStoppedTyping` - User stopped typing

### 3. Chat Page (Main Interface)

**File**: `src/app/chat/page.tsx`

**Purpose**: Main chat interface that orchestrates all chat functionality.

**Key Features**:
- Real-time messaging
- Chat selection and management
- Message sending and receiving
- Typing indicators
- Image sharing
- Message status tracking
- Online user indicators

**State Management**:
```typescript
const [selectedUser, setSelectedUser] = useState<string | null>(null);
const [message, setMessage] = useState("");
const [sidebarOpen, setSidebarOpen] = useState(false);
const [messages, setMessages] = useState<Message[] | null>(null);
const [user, setUser] = useState<User | null>(null);
const [showAllUsers, setShowAllUsers] = useState(false);
const [isTyping, setIsTyping] = useState(false);
const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
```

**Key Functions**:
- `fetchChat()` - Load chat messages
- `createChat()` - Create new chat
- `handleMessageSend()` - Send message with image support
- `handleTyping()` - Handle typing indicators
- `moveChatToTop()` - Update chat list order
- `resetUnseenCount()` - Reset unread message count

### 4. ChatMessages Component

**File**: `src/components/ChatMessages.tsx`

**Purpose**: Displays chat messages with proper formatting and status indicators.

**Key Features**:
- Message rendering with sender distinction
- Image message support
- Message status indicators (✓ and ✓✓)
- Timestamp formatting with Moment.js
- Auto-scroll to latest message
- Duplicate message prevention

**Props Interface**:
```typescript
interface ChatMessagesProps {
  selectedUser: string | null;         // Currently selected chat
  messages: Message[] | null;          // Array of messages
  loggedInUser: User | null;           // Current user
}
```

**Message Types**:
- **Text Messages**: Plain text with sender styling
- **Image Messages**: Image display with Cloudinary URLs
- **Status Indicators**: Delivery (✓) and read (✓✓) status

### 5. MessageInput Component

**File**: `src/components/MessageInput.tsx`

**Purpose**: Handles message input with text and image support.

**Key Features**:
- Text input with typing indicators
- Image upload with preview
- File type validation (images only)
- Loading states during upload
- Caption support for images

**Props Interface**:
```typescript
interface MessageInputProps {
  selectedUser: string | null;         // Currently selected chat
  message: string;                     // Current message text
  setMessage: (message: string) => void; // Message setter
  handleMessageSend: (e: any, imageFile?: File | null) => void; // Send handler
}
```

**Features**:
- **Image Preview**: Shows selected image before sending
- **File Validation**: Only accepts image files
- **Loading States**: Shows spinner during upload
- **Form Validation**: Prevents empty message sending

### 6. ChatSidebar Component

**File**: `src/components/chatSidebar.tsx`

**Purpose**: Displays chat list, user list, and navigation controls.

**Key Features**:
- Chat history display
- User search and selection
- Online status indicators
- Unread message counts
- Responsive design for mobile

**Features**:
- **Chat List**: Shows all user's conversations
- **User List**: Displays all available users
- **Online Indicators**: Green dots for online users
- **Unread Counts**: Badge showing unread messages
- **Search Functionality**: Filter users and chats

### 7. ChatHeader Component

**File**: `src/components/chatHeader.tsx`

**Purpose**: Displays chat header with user info and controls.

**Key Features**:
- User information display
- Online status indicator
- Typing indicator
- Mobile menu toggle
- Back navigation

## Page Components

### 1. Login Page

**File**: `src/app/login/page.tsx`

**Features**:
- User authentication form
- Email and password validation
- Error handling and display
- Redirect to chat after login
- Responsive design

### 2. Profile Page

**File**: `src/app/profile/page.tsx`

**Features**:
- User profile display
- Profile editing capabilities
- Account management
- Logout functionality

### 3. Verify Page

**File**: `src/app/verify/page.tsx`

**Features**:
- OTP verification form
- Email verification process
- Resend OTP functionality
- Success/error feedback

## Styling and UI

### Tailwind CSS Configuration

**File**: `tailwind.config.js`

The application uses Tailwind CSS 4 with custom configurations:

```javascript
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Custom theme extensions
    },
  },
  plugins: [],
}
```

### Design System

**Color Palette**:
- **Primary**: Blue (#3B82F6)
- **Background**: Dark gray (#111827)
- **Surface**: Gray with transparency (#374151)
- **Text**: White and light gray
- **Accent**: Green for online status

**Typography**:
- **Font Family**: System fonts (Inter, -apple-system, BlinkMacSystemFont)
- **Font Sizes**: Responsive scale from 12px to 24px
- **Font Weights**: 400 (normal), 500 (medium), 600 (semibold)

**Spacing**:
- **Padding**: 4px, 8px, 12px, 16px, 24px, 32px
- **Margin**: 4px, 8px, 12px, 16px, 24px, 32px
- **Gap**: 4px, 8px, 12px, 16px, 24px

## State Management

### Context Providers Hierarchy

```jsx
<AppProvider>
  <SocketProvider>
    <App />
  </SocketProvider>
</AppProvider>
```

### State Flow

1. **App Initialization**:
   - Check for existing authentication token
   - Fetch user data if authenticated
   - Initialize socket connection
   - Load chat data

2. **User Authentication**:
   - Login/Register → Update AppContext
   - Token storage in cookies
   - Socket connection with user ID

3. **Real-time Updates**:
   - Socket events → Update local state
   - UI re-renders with new data
   - Optimistic updates for better UX

## API Integration

### Service Configuration

```typescript
// API Service URLs
export const user_service = "http://localhost:5000";
export const chat_service = "http://localhost:5002";
```

### HTTP Client Setup

```typescript
// Axios configuration with interceptors
axios.defaults.baseURL = service_url;
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

### Error Handling

```typescript
// Global error handling with toast notifications
try {
  const response = await axios.get('/api/endpoint');
  return response.data;
} catch (error) {
  toast.error(error.response?.data?.message || 'An error occurred');
  throw error;
}
```

## Real-time Features

### Socket.io Integration

**Connection Setup**:
```typescript
const socket = io(chat_service, {
  query: {
    userId: user?._id
  }
});
```

**Event Handling**:
```typescript
// Listen for new messages
socket.on('newMessage', (message) => {
  setMessages(prev => [...prev, message]);
});

// Listen for typing indicators
socket.on('userTyping', (data) => {
  setIsTyping(true);
});
```

**Event Emission**:
```typescript
// Send typing indicator
socket.emit('typing', {
  userId: loggedInUser?._id,
  chatId: selectedUser
});

// Send message
socket.emit('sendMessage', messageData);
```

## Performance Optimizations

### React Optimizations

1. **useMemo for Expensive Calculations**:
```typescript
const uniqueMessages = useMemo(() => {
  // Filter duplicate messages
  return messages?.filter((message, index, self) => 
    index === self.findIndex(m => m._id === message._id)
  );
}, [messages]);
```

2. **useCallback for Event Handlers**:
```typescript
const handleMessageSend = useCallback((e: any, imageFile?: File) => {
  // Message sending logic
}, [selectedUser, message]);
```

3. **Lazy Loading for Components**:
```typescript
const LazyComponent = lazy(() => import('./HeavyComponent'));
```

### Bundle Optimization

1. **Code Splitting**:
   - Automatic code splitting with Next.js
   - Dynamic imports for heavy components
   - Route-based splitting

2. **Image Optimization**:
   - Next.js Image component for automatic optimization
   - Cloudinary integration for CDN delivery
   - Lazy loading for images

## Responsive Design

### Breakpoints

```css
/* Mobile First Approach */
sm: '640px'   /* Small devices */
md: '768px'   /* Medium devices */
lg: '1024px'  /* Large devices */
xl: '1280px'  /* Extra large devices */
```

### Mobile Features

- **Touch-friendly Interface**: Large touch targets
- **Swipe Gestures**: Chat navigation
- **Responsive Sidebar**: Collapsible on mobile
- **Optimized Typography**: Readable on small screens

## Accessibility Features

### ARIA Labels and Roles

```jsx
<button
  aria-label="Send message"
  role="button"
  disabled={!message.trim()}
>
  <SendIcon />
</button>
```

### Keyboard Navigation

- **Tab Navigation**: All interactive elements
- **Enter Key**: Send message
- **Escape Key**: Close modals
- **Arrow Keys**: Navigate chat list

### Screen Reader Support

- **Semantic HTML**: Proper heading structure
- **Alt Text**: Image descriptions
- **Live Regions**: Real-time updates
- **Focus Management**: Logical focus flow

## Testing Strategy

### Component Testing

```typescript
// Example test for ChatMessages component
import { render, screen } from '@testing-library/react';
import ChatMessages from './ChatMessages';

test('renders messages correctly', () => {
  const mockMessages = [
    { _id: '1', text: 'Hello', sender: 'user1' },
    { _id: '2', text: 'Hi there', sender: 'user2' }
  ];
  
  render(
    <ChatMessages 
      messages={mockMessages}
      selectedUser="chat1"
      loggedInUser={{ _id: 'user1', name: 'User 1' }}
    />
  );
  
  expect(screen.getByText('Hello')).toBeInTheDocument();
  expect(screen.getByText('Hi there')).toBeInTheDocument();
});
```

### Integration Testing

- **API Integration**: Mock API calls
- **Socket.io Testing**: Mock socket events
- **User Flows**: End-to-end testing
- **Error Scenarios**: Error handling testing

## Deployment

### Build Process

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

```env
NEXT_PUBLIC_USER_SERVICE_URL=http://localhost:5000
NEXT_PUBLIC_CHAT_SERVICE_URL=http://localhost:5002
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Vercel Deployment

1. **Connect Repository**: Link GitHub repository
2. **Configure Environment**: Set environment variables
3. **Deploy**: Automatic deployment on push
4. **Custom Domain**: Configure custom domain (optional)

## Browser Support

### Supported Browsers

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### Feature Detection

```typescript
// Check for WebSocket support
const supportsWebSocket = 'WebSocket' in window;

// Check for File API support
const supportsFileAPI = 'File' in window && 'FileReader' in window;
```

## Security Considerations

### Client-Side Security

1. **Input Validation**: Client-side validation
2. **XSS Prevention**: Sanitize user input
3. **CSRF Protection**: Token-based protection
4. **Secure Cookies**: HttpOnly and Secure flags

### Data Protection

1. **Token Storage**: Secure cookie storage
2. **API Security**: HTTPS only in production
3. **Input Sanitization**: Prevent malicious input
4. **Error Handling**: Don't expose sensitive data

## Future Enhancements

### Planned Features

1. **Push Notifications**: Browser notifications
2. **File Sharing**: Document and media sharing
3. **Video Calling**: WebRTC integration
4. **Message Encryption**: End-to-end encryption
5. **Dark/Light Theme**: Theme switching
6. **Offline Support**: Service worker implementation

### Performance Improvements

1. **Virtual Scrolling**: For large message lists
2. **Message Pagination**: Load messages in chunks
3. **Image Compression**: Client-side compression
4. **Bundle Splitting**: Further optimization

---

This frontend documentation provides comprehensive coverage of the Next.js application architecture, components, and features for the Real-Time Chat Application.
