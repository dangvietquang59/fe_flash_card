# Chinese Flashcard Application

A web application for learning Chinese vocabulary with flashcards.

## Features

- Flashcard-based learning with front and back card views
- Filter flashcards by HSK level
- Search functionality with debounced input
- API integration for fetching flashcards from external source
- Progress tracking

## API Integration

The application integrates with a flashcard API at `https://be-flash-card.onrender.com/api/flashcards`.

### API Features:

- **Level Filtering**: Filter cards by HSK level (1-6) using the `level` parameter
- **Search Functionality**: Search for specific cards with the `query` parameter
- **Debounced Search**: Implemented client-side debouncing to improve performance

## Implementation Details

### useFlashcards Hook

The custom hook `useFlashcards` in `hooks/use-flashcards.ts` provides:

- Fetching flashcards from the API with level filtering
- Debounced search functionality
- Loading and error states
- Refetch capability

```typescript
// Usage example
const { 
  flashcards, 
  isLoading, 
  error, 
  query, 
  setQuery 
} = useFlashcards({
  level: 1,              // Optional: Filter by HSK level
  initialQuery: '',      // Optional: Initial search query
  debounceTime: 500      // Optional: Debounce delay in ms
});
```

### FlashcardSearch Component

The `FlashcardSearch` component provides a user interface for:

- Searching flashcards with debounced input
- Filtering by HSK level
- Displaying flashcards in a grid layout
- Handling loading and error states

## API Endpoints

- **GET** `/api/flashcards`: Get all flashcards
- **GET** `/api/flashcards?level=1`: Get flashcards filtered by HSK level 1
- **GET** `/api/flashcards?query=你好`: Search for flashcards containing "你好"
- **GET** `/api/flashcards?level=1&query=你好`: Combined filtering and searching

## Setup and Development

1. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   pnpm install
   ```

2. Run the development server:
   ```
   npm run dev
   ```
   or
   ```
   pnpm dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser 