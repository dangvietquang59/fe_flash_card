import { useState } from "react";
import QuizMultipleChoice from "./QuizMultipleChoice";
import QuizFillIn from "./QuizFillIn";
import { Button } from "@/components/ui/button";

const quizModes = [
  { key: "multiple", label: "Chọn đáp án" },
  { key: "fillin", label: "Điền chữ" },
];

export default function FlashcardQuiz() {
  const [mode, setMode] = useState("multiple");

  return (
    <div>
      <div className="flex justify-center gap-4 mb-8">
        {quizModes.map((m) => (
          <Button
            key={m.key}
            variant={mode === m.key ? "default" : "outline"}
            onClick={() => setMode(m.key)}
          >
            {m.label}
          </Button>
        ))}
      </div>
      {mode === "multiple" && <QuizMultipleChoice />}
      {mode === "fillin" && <QuizFillIn />}
    </div>
  );
} 