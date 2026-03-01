# e-Library

## Current State
No existing code. This is a fresh build.

## Requested Changes (Diff)

### Add
- Book catalog with browse, search, and filter by genre/author
- Book detail pages with metadata (title, author, genre, description, cover)
- Chapter-based reading view with plain text content
- User favorites/bookmarks (requires login via Internet Identity)
- User ratings and reviews per book
- Reading progress tracking per user per book
- Admin dashboard to add and manage books and chapters
- Role-based access: admin vs regular user

### Modify
N/A

### Remove
N/A

## Implementation Plan

**Backend (Motoko):**
- Data models: Book (id, title, author, genre, description, coverUrl, createdAt), Chapter (id, bookId, title, order, content), Review (id, bookId, userId, rating, comment, createdAt), UserProgress (userId, bookId, chapterIndex), Favorite (userId, bookId)
- CRUD for books and chapters (admin only)
- Public queries: list books, get book by id, list chapters by book, get chapter content, search books
- Authenticated mutations: add/remove favorite, submit review, update reading progress
- Admin check via authorization component

**Frontend (React + TypeScript):**
- Home page: featured/recent books grid with search bar and genre filter
- Book detail page: cover, metadata, reviews, start reading button
- Reader page: chapter content display with prev/next navigation, progress tracking
- Favorites page: list of favorited books (authenticated)
- Admin dashboard: add/edit/delete books and chapters
- Auth via Internet Identity (login/logout in header)
