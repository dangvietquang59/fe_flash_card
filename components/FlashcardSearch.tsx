import { useState } from 'react';
import { useFlashcards } from '@/hooks/use-flashcards';

interface FlashcardSearchProps {
  initialLevel?: number;
}

const FlashcardSearch = ({ initialLevel }: FlashcardSearchProps) => {
  const [level, setLevel] = useState<number | undefined>(initialLevel);
  const { flashcards, isLoading, error, query, setQuery } = useFlashcards({
    level,
    initialQuery: '',
  });

  const handleLevelChange = (newLevel: number | undefined) => {
    setLevel(newLevel);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex flex-col gap-4 mb-6">
        <h2 className="text-2xl font-bold">Từ vựng tiếng Trung từ API</h2>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search input */}
          <div className="flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm từ vựng..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Level filter */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">HSK Level:</span>
            <div className="flex space-x-1">
              {[undefined, 1, 2, 3, 4, 5, 6].map((lvl, index) => (
                <button
                  key={index}
                  onClick={() => handleLevelChange(lvl)}
                  className={`px-3 py-1 text-sm rounded-md ${
                    level === lvl
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {lvl === undefined ? 'All' : lvl}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Results */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {flashcards.length > 0 ? (
            flashcards.map((card) => (
              <div
                key={card.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{card.word}</h3>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    HSK {card.level}
                  </span>
                </div>
                <p className="text-gray-600 mb-1">{card.pinyin}</p>
                <p className="font-medium mb-3">{card.meaning}</p>
                
                {card.example_chinese && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm">{card.example_chinese}</p>
                    <p className="text-sm text-gray-600">{card.example_pinyin}</p>
                    <p className="text-sm italic">{card.example_meaning}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              Không tìm thấy từ vựng. Vui lòng điều chỉnh tìm kiếm hoặc bộ lọc.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FlashcardSearch; 