import { useState, useMemo } from "react";
import { useFlashcards } from "@/hooks/use-flashcards";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function QuizFillIn() {
  const { flashcards, isLoading, error } = useFlashcards();
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Tạo câu hỏi
  const question = useMemo(() => {
    if (flashcards.length === 0 || current >= flashcards.length) return null;
    return flashcards[current];
  }, [flashcards, current]);

  const total = flashcards.length;
  const progress = total > 0 ? ((current) / total) * 100 : 0;

  if (isLoading) return <div className="py-8 text-center">Đang tải...</div>;
  if (error) return <div className="py-8 text-center text-red-500">{error}</div>;
  if (showResult || !question) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8 flex flex-col items-center animate-fade-in">
        <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">Hoàn thành Quiz!</h2>
        <div className="text-5xl font-extrabold text-green-600 mb-2">{score}/{total}</div>
        <div className="text-lg text-gray-700 mb-6">Số câu đúng</div>
        <Progress value={100} className="mb-6 h-3" />
        <Button onClick={() => { setCurrent(0); setScore(0); setShowResult(false); setInput(""); setChecked(false); setIsCorrect(null); }}>
          Làm lại Quiz
        </Button>
      </div>
    );
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

  const handleCheck = () => {
    const correct = question.word.trim();
    const userInput = input.trim();
    const isRight = userInput === correct;
    setIsCorrect(isRight);
    setChecked(true);
    if (isRight) setScore(score + 1);
  };

  const next = () => {
    setInput("");
    setChecked(false);
    setIsCorrect(null);
    if (current + 1 >= total) {
      setShowResult(true);
    } else {
      setCurrent(current + 1);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="text-base text-gray-500">Câu {current + 1} / {total}</div>
        <Badge className={getHskLevelColor(question.level)}>
          HSK {question.level}
        </Badge>
      </div>
      <Progress value={progress} className="mb-6 h-2" />
      <div className="text-2xl font-bold mb-2 text-center text-blue-800 drop-shadow">{question.meaning}</div>
      <div className="mb-8 text-center text-gray-400">Nhập từ tiếng Trung đúng với nghĩa trên</div>
      <div className="flex flex-col gap-4 items-center">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={checked}
          className={`w-full max-w-xs px-4 py-3 border rounded-lg text-xl text-center focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all ${checked ? (isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-gray-300 bg-white'}`}
          placeholder="Gõ từ tiếng Trung..."
        />
        {!checked ? (
          <Button onClick={handleCheck} disabled={!input.trim()} className="w-full max-w-xs">Kiểm tra</Button>
        ) : (
          <div className="w-full flex flex-col items-center">
            <div className={`font-semibold mb-2 text-lg ${isCorrect ? "text-green-600" : "text-red-600"}`}>
              {isCorrect ? "🎉 Đúng rồi!" : `❌ Sai! Đáp án: ${question.word}`}
            </div>
            <Button onClick={next} className="mt-2 w-full max-w-xs">{current + 1 === total ? "Xem kết quả" : "Câu tiếp"}</Button>
          </div>
        )}
      </div>
      <div className="mt-8 text-center text-gray-600">Điểm: {score}/{current + (checked ? 1 : 0)}</div>
    </div>
  );
} 