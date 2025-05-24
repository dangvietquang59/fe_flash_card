"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, RotateCw, Search, X, Filter, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useFlashcards } from "@/hooks/use-flashcards"
import dynamic from "next/dynamic"

const FlashcardQuiz = dynamic(() => import("@/components/FlashcardQuiz"), { ssr: false })

export default function FlashCardApp() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [progress, setProgress] = useState(0)
  const [completedCards, setCompletedCards] = useState<number[]>([])
  const [selectedLevel, setSelectedLevel] = useState<number>(0)
  const [showQuiz, setShowQuiz] = useState(false)

  const [level, setLevel] = useState<number | undefined>(1);
  const { flashcards, isLoading, error, query, setQuery } = useFlashcards({
    level,
    initialQuery: '',
  });

  const hskLevels = [0,1, 2, 3, 4, 5, 6, 7, 8, 9]
  
  // Cập nhật level khi selectedLevel thay đổi
  useEffect(() => {
    setLevel(selectedLevel)
  }, [selectedLevel])
  
  // Cập nhật progress dựa trên số lượng card đã học
  useEffect(() => {
    if (flashcards.length > 0) {
      setProgress((completedCards.length / flashcards.length) * 100)
    }
  }, [completedCards, flashcards])
  
  // Reset currentIndex khi flashcards thay đổi
  useEffect(() => {
    setCurrentIndex(0)
  }, [flashcards])

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsFlipped(false)
    }
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const markAsCompleted = () => {
    if (flashcards.length > 0 && !completedCards.includes(flashcards[currentIndex].id)) {
      setCompletedCards([...completedCards, flashcards[currentIndex].id])
    }
    handleNext()
  }

  const resetProgress = () => {
    setCompletedCards([])
    setCurrentIndex(0)
    setIsFlipped(false)
  }

  const clearSearch = () => {
    setQuery("")
  }

  // Lấy màu tương ứng với cấp độ HSK
  const getHskLevelColor = (level: number) => {
    switch (level) {
      case 1:
        return "bg-green-100 text-green-800"
      case 2:
        return "bg-blue-100 text-blue-800"
      case 3:
        return "bg-yellow-100 text-yellow-800"
      case 4:
        return "bg-orange-100 text-orange-800"
      case 5:
        return "bg-purple-100 text-purple-800"
      case 6:
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Render current flashcard safely
  const renderFlashcard = () => {
    if (!flashcards || flashcards.length === 0 || currentIndex >= flashcards.length) {
      return null;
    }

    const currentCard = flashcards[currentIndex];
    
    return (
      <>
        <div
          className="relative mx-auto mb-8 min-h-[400px] md:min-h-[500px] w-full max-w-xl cursor-pointer rounded-xl bg-white shadow-lg perspective-1000"
          onClick={handleFlip}
        >
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center rounded-xl p-6 backface-hidden transition-all duration-500 ${
              isFlipped ? "rotate-y-180 opacity-0" : "rotate-y-0 opacity-100"
            }`}
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm font-medium text-blue-600">
                {currentIndex + 1}/{flashcards.length}
              </span>
              <Badge className={getHskLevelColor(currentCard.level)}>
                HSK {currentCard.level}
              </Badge>
            </div>
         <div className="flex flex-col gap-2 justify-center items-center my-auto">
              <h2 className="mb-4 text-center text-[72px] font-bold text-gray-800">
                {currentCard.word}
              </h2>
              <p className="text-center text-[30px] text-gray-600">{currentCard.pinyin}</p>
         </div>
            <div className="mt-auto text-center text-sm text-gray-400">Nhấn để xem nghĩa</div>
          </div>

          <div
            className={`absolute inset-0 flex flex-col items-center justify-center rounded-xl p-6 backface-hidden transition-all duration-500 ${
              isFlipped ? "rotate-y-0 opacity-100" : "rotate-y-180 opacity-0"
            }`}
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm font-medium text-blue-600">
                {currentIndex + 1}/{flashcards.length}
              </span>
              <Badge className={getHskLevelColor(currentCard.level)}>
                HSK {currentCard.level}
              </Badge>
            </div>
            <h3 className="mb-4 text-center text-3xl font-bold text-gray-800">
              {currentCard.meaning}
            </h3>
            <div className="mb-4 rounded-lg bg-blue-50 p-4 w-full">
                <p className="mb-2 text-[20px] font-bold text-gray-700">{currentCard.word}</p>
                <p className="mb-4 text-[20px] text-gray-600">{`[ ${currentCard.pinyin} ]`}</p>
              {currentCard.example_chinese && (
                <div className="rounded-md bg-white p-3">
                  <p className="text-[16px] text-gray-700">
                    <span className="font-medium">Ví dụ:</span> 
                  </p>
                 <div className="flex flex-col gap-2 justify-center items-center">
                    <p className="text-[16px] text-gray-600">{currentCard.example_chinese}</p>
                    <p className="text-[16px] text-gray-600">{currentCard.example_pinyin}</p>
                    <p className="text-[16px] text-gray-700">{currentCard.example_meaning}</p>
                 </div>
                </div>
              )}
            </div>
            <div className="mt-auto text-center text-sm text-gray-400">Nhấn để xem từ vựng</div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Trước
          </Button>
          <Button onClick={markAsCompleted} className="bg-blue-600 hover:bg-blue-700">
            {completedCards.includes(currentCard.id) ? "Đã học" : "Đánh dấu đã học"}
          </Button>
          <Button
            variant="outline"
            onClick={handleNext}
            disabled={currentIndex === flashcards.length - 1}
            className="flex items-center gap-1"
          >
            Tiếp <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Test font component */}
      
        <h1 className="mb-6 text-center text-3xl font-bold text-blue-800">Flash Card Từ Vựng Tiếng Trung</h1>
        <div className="flex justify-center mb-6">
          <Button
            variant={showQuiz ? "outline" : "default"}
            onClick={() => setShowQuiz(false)}
            className="mr-2"
          >
            Học Flashcard
          </Button>
          <Button
            variant={showQuiz ? "default" : "outline"}
            onClick={() => setShowQuiz(true)}
          >
            Quiz Trắc nghiệm
          </Button>
        </div>
        {showQuiz ? (
          <FlashcardQuiz />
        ) : (
          <div>
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Tìm kiếm từ vựng..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10 pr-10"
                />
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                {query && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Bộ lọc cấp độ HSK */}
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <span>HSK {selectedLevel}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {hskLevels.map((level) => (
                      <DropdownMenuCheckboxItem
                        key={level}
                        checked={selectedLevel === level}
                        onClick={() => {setSelectedLevel(level)}}
                      >
                       {level === 0 ? "Tất cả" : `HSK ${level}`}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <span className="text-sm text-gray-600">
                  Đã học: {completedCards.length}/{flashcards.length}
                </span>
                <Button variant="outline" size="icon" onClick={resetProgress} title="Đặt lại tiến trình">
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Progress value={progress} className="mb-8 h-2" />

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

            {/* Content */}
            {!isLoading && !error && (
              <>
                {flashcards.length > 0 ? (
                  renderFlashcard()
                ) : (
                  <div className="flex h-80 flex-col items-center justify-center rounded-xl bg-white p-6 text-center shadow-lg">
                    <p className="mb-4 text-xl text-gray-600">Không tìm thấy từ vựng phù hợp</p>
                    <div className="flex gap-2">
                      <Button onClick={clearSearch}>Xóa tìm kiếm</Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
