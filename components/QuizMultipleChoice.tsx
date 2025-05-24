import { useState, useMemo } from "react";
import { useFlashcards } from "@/hooks/use-flashcards";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function QuizMultipleChoice() {
  const { flashcards, isLoading, error } = useFlashcards();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // Tạo câu hỏi và đáp án
  const question = useMemo(() => {
    if (flashcards.length === 0 || current >= flashcards.length) return null;
    const correct = flashcards[current];
    // Lấy 3 đáp án sai ngẫu nhiên
    const wrongs = flashcards
      .filter((f) => f.id !== correct.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    // Trộn đáp án
    const options = [...wrongs, correct].sort(() => 0.5 - Math.random());
    return { correct, options };
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
        <Button onClick={() => { setCurrent(0); setScore(0); setShowResult(false); setSelected(null); }}>
          Làm lại Quiz
        </Button>
      </div>
    );
  }

  const handleSelect = (option: any) => {
    setSelected(option.id);
    if (option.id === question.correct.id) setScore(score + 1);
  };

  const next = () => {
    setSelected(null);
    if (current + 1 >= total) {
      setShowResult(true);
    } else {
      setCurrent(current + 1);
    }
  };

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

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="text-base text-gray-500">Câu {current + 1} / {total}</div>
        <Badge className={getHskLevelColor(question.correct.level)}>
          HSK {question.correct.level}
        </Badge>
      </div>
      <Progress value={progress} className="mb-6 h-2" />
      <div className="text-3xl font-extrabold mb-2 text-center text-blue-800 drop-shadow">{question.correct.word}</div>
      <div className="text-xl text-center text-gray-600 mb-2">{question.correct.pinyin}</div>
      <div className="mb-8 text-center text-gray-400">Chọn nghĩa đúng cho từ trên</div>
      <div className="flex flex-col gap-4">
        {question.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleSelect(opt)}
            disabled={selected !== null}
            className={`transition-all duration-200 w-full py-3 px-4 rounded-xl border text-lg font-medium shadow-sm text-left
              ${selected === null ? "hover:bg-blue-50 hover:border-blue-400" : ""}
              ${selected === opt.id
                ? opt.id === question.correct.id
                  ? "bg-green-500 border-green-600 text-white scale-[1.03]"
                  : "bg-red-500 border-red-600 text-white scale-[1.03]"
                : selected !== null && opt.id === question.correct.id
                  ? "bg-green-100 border-green-400 text-green-800"
                  : "bg-gray-50 border-gray-200 text-gray-700"
              }`}
          >
            {opt.meaning}
          </button>
        ))}
      </div>
      {selected !== null && (
        <div className="mt-8 text-center animate-fade-in">
          <div className={`font-semibold mb-2 text-lg ${selected === question.correct.id ? "text-green-600" : "text-red-600"}`}>
            {selected === question.correct.id ? "🎉 Đúng rồi!" : `❌ Sai! Đáp án: ${question.correct.meaning}`}
          </div>
          <Button onClick={next} className="mt-2">{current + 1 === total ? "Xem kết quả" : "Câu tiếp"}</Button>
        </div>
      )}
      <div className="mt-8 text-center text-gray-600">Điểm: {score}/{current + (selected === null ? 0 : 1)}</div>
    </div>
  );
} 