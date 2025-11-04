# Architecture Documentation

## System Overview

The Music Streaming Platform is a full-stack web application built with a modern tech stack following best practices for scalability, maintainability, and performance.

## Architecture Pattern

The application follows a **three-tier architecture**:

1. **Presentation Layer** (Frontend)
2. **Application Layer** (Backend API)
3. **Data Layer** (PostgreSQL Database)

## Technology Stack

### Backend Stack
- **FastAPI**: High-performance Python web framework
- **SQLAlchemy**: SQL toolkit and ORM
- **Alembic**: Database migration tool
- **PostgreSQL**: Relational database
- **Pydantic**: Data validation using Python type annotations
- **JWT**: JSON Web Tokens for authentication
- **Uvicorn**: ASGI server

### Frontend Stack
- **React 18**: Component-based UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Zustand**: Lightweight state management
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Howler.js**: Audio playback library

## Backend Architecture

### Directory Structure

```
src/backend/
├── routes/           # API endpoints
│   ├── auth.py      # Authentication routes
│   ├── users.py     # User management
│   ├── songs.py     # Song operations
│   ├── playlists.py # Playlist management
│   └── albums.py    # Album operations
├── models/          # SQLAlchemy models
│   └── __init__.py  # Database models
├── schemas.py       # Pydantic schemas
├── auth.py          # Authentication utilities
├── dependencies.py  # FastAPI dependencies
├── database.py      # Database configuration
├── config.py        # Application settings
└── main.py          # FastAPI application
```

### Data Models

#### User Model
- Handles user authentication and authorization
- Supports multiple roles: user, premium, creator, admin
- Relationships: playlists, albums, songs, liked_songs

#### Song Model
- Stores music track information
- Requires approval for creator uploads
- Tracks play count for analytics
- Relationships: album, creator, playlists, likes

#### Album Model
- Groups songs together
- Requires approval for creator uploads
- Relationships: creator, songs

#### Playlist Model
- User-created song collections
- Public/private visibility
- Relationships: owner, songs

### Authentication Flow

1. User registers with email, username, and password
2. Password is hashed using bcrypt
3. Login endpoint validates credentials
4. JWT token is generated and returned
5. Token is included in Authorization header for protected routes
6. Token is validated on each request via dependencies

### Role-Based Access Control (RBAC)

- **User**: Basic streaming access, create playlists
- **Premium**: Ad-free, additional features
- **Creator**: Upload content (requires approval)
- **Admin**: Full access, content moderation

## Frontend Architecture

### Directory Structure

```
src/frontend/src/
├── components/      # Reusable components
│   ├── Layout.tsx   # Main layout wrapper
│   ├── Navbar.tsx   # Top navigation
│   ├── Sidebar.tsx  # Side navigation
│   ├── Player.tsx   # Audio player
│   └── SongCard.tsx # Song display card
├── pages/          # Route pages
│   ├── Home.tsx    # Landing page
│   ├── Login.tsx   # Login page
│   └── Register.tsx # Registration page
├── store/          # State management
│   ├── authStore.ts    # Authentication state
│   └── playerStore.ts  # Player state
├── types/          # TypeScript definitions
│   └── index.ts
├── lib/            # Utilities
│   └── axios.ts    # Axios configuration
├── App.tsx         # Main app component
├── main.tsx        # App entry point
└── index.css       # Global styles
```

### State Management

#### Auth Store (Zustand)
- User authentication state
- Login/register/logout functions
- Token management
- User profile data

#### Player Store (Zustand)
- Current song and queue
- Play/pause state
- Volume control
- Playback controls
- Howler.js integration

### Component Hierarchy

```
App
├── BrowserRouter
│   ├── Login
│   ├── Register
│   └── Layout (Protected)
│       ├── Sidebar
│       ├── Navbar
│       ├── Outlet (Pages)
│       │   ├── Home
│       │   ├── Search
│       │   ├── Library
│       │   └── Liked
│       └── Player
```

## Database Schema

### Tables

#### users
- id (PK)
- email (unique)
- username (unique)
- hashed_password
- role (enum)
- is_active
- profile_picture
- created_at
- updated_at

#### songs
- id (PK)
- title
- artist
- duration
- file_path
- cover_image
- album_id (FK)
- creator_id (FK)
- is_approved
- play_count
- created_at
- updated_at

#### albums
- id (PK)
- title
- description
- cover_image
- release_date
- creator_id (FK)
- is_approved
- created_at
- updated_at

#### playlists
- id (PK)
- name
- description
- cover_image
- is_public
- owner_id (FK)
- created_at
- updated_at

#### playlist_songs (Junction Table)
- id (PK)
- playlist_id (FK)
- song_id (FK)
- position
- added_at

#### liked_songs (Junction Table)
- id (PK)
- user_id (FK)
- song_id (FK)
- liked_at

## API Design

### RESTful Principles
- Resource-based URLs
- HTTP verbs (GET, POST, PATCH, DELETE)
- Status codes (200, 201, 400, 401, 403, 404, 500)
- JSON request/response format

### Authentication
- Bearer token in Authorization header
- JWT with expiration
- Token refresh mechanism (future)

### Error Handling
- Consistent error response format
- Detailed error messages
- HTTP status codes

## Security Considerations

1. **Password Security**
   - Bcrypt hashing
   - Salt generation
   - No plain text storage

2. **JWT Security**
   - Short expiration time
   - Secret key in environment variables
   - HTTPS in production

3. **CORS**
   - Configured origins
   - Credentials support

4. **Input Validation**
   - Pydantic schemas
   - SQL injection prevention (SQLAlchemy)
   - XSS protection

5. **File Upload** (Future)
   - File type validation
   - Size limits
   - Virus scanning

## Performance Optimization

### Backend
- Database connection pooling
- Query optimization with SQLAlchemy
- Async/await with FastAPI
- Pagination for large datasets
- Caching (future: Redis)

### Frontend
- Code splitting with Vite
- Lazy loading routes
- Image optimization
- Component memoization
- Virtual scrolling (future)

### Database
- Indexed columns (email, username)
- Foreign key constraints
- Query optimization

## Scalability Considerations

### Horizontal Scaling
- Stateless API design
- JWT for authentication (no sessions)
- CDN for static assets (future)
- Load balancing (future)

### Vertical Scaling
- Database optimization
- Caching layer (Redis)
- File storage (S3/Cloud)

## Deployment Strategy

### Development
- Local development servers
- SQLite for quick testing (optional)
- Hot reload enabled

### Production (Future)
- Docker containerization
- Kubernetes orchestration
- PostgreSQL managed service
- CDN for frontend assets
- S3 for audio files
- CI/CD pipeline

## Monitoring & Logging

### Backend
- FastAPI built-in logging
- Database query logging
- Error tracking (Sentry - future)

### Frontend
- Console logging (development)
- Error boundary components
- Analytics (future)

## Testing Strategy

### Backend
- Unit tests with pytest
- Integration tests
- API endpoint tests

### Frontend
- Component tests (Jest)
- E2E tests (Cypress - future)
- Accessibility tests

## Future Enhancements

1. **File Upload System**
   - Audio file processing
   - Image optimization
   - Cloud storage integration

2. **Real-time Features**
   - WebSocket for live updates
   - Collaborative playlists
   - Listen along feature

3. **Analytics**
   - User listening habits
   - Popular songs/artists
   - Creator dashboard

4. **Social Features**
   - Follow artists
   - Share playlists
   - Comments/reviews

5. **Payment Integration**
   - Stripe for Premium subscriptions
   - Creator monetization

6. **Advanced Player**
   - Equalizer
   - Lyrics sync
   - Crossfade
   - Gapless playback

## Development Workflow

1. Create feature branch
2. Develop feature
3. Write tests
4. Code review
5. Merge to main
6. Deploy

## Coding Standards

- English code and comments
- Type hints in Python
- TypeScript strict mode
- ESLint/Prettier for formatting
- Meaningful variable names
- RESTful API conventions

---

**Version**: 1.0.0
**Last Updated**: November 2025
