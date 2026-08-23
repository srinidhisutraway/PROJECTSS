import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// ✅ TECH QUESTIONS BANK
const questionBank = {
  JavaScript: [
    {
      q: "What will `console.log(typeof [])` print?",
      options: ["array", "object", "undefined", "null"],
      ans: 1,
      explanation: "Arrays in JS are objects, so typeof [] = 'object'.",
    },
    {
      q: "Which method selects an element by ID in JS?",
      options: ["getElementByClassName", "getElementById", "querySelectorAll", "querySelectorAllById"],
      ans: 1,
      explanation: "`document.getElementById('id')` selects an element by ID.",
    },
    {
      q: "What is the output of `[1,2,3].map(x => x*2)`?",
      options: ["[2,4,6]", "[1,2,3]", "[1,4,9]", "[3,6,9]"],
      ans: 0,
      explanation: "map multiplies each element by 2, producing [2,4,6].",
    },
  ],
  Python: [
    {
      q: "What is `len([1,2,3,4])` in Python?",
      options: ["3", "4", "5", "Error"],
      ans: 1,
      explanation: "len() returns the number of elements, here 4.",
    },
    {
      q: "Which of these is mutable in Python?",
      options: ["tuple", "list", "str", "int"],
      ans: 1,
      explanation: "Lists are mutable; tuples, strings, and ints are immutable.",
    },
  ],
  Java: [
    {
      q: "Keyword to inherit a class in Java?",
      options: ["implements", "extends", "inherits", "super"],
      ans: 1,
      explanation: "'extends' is used to inherit a class.",
    },
    {
      q: "Which is NOT an OOP principle?",
      options: ["Encapsulation", "Polymorphism", "Inheritance", "Compilation"],
      ans: 3,
      explanation: "Compilation is not an OOP principle.",
    },
  ],
  "C++": [
    {
      q: "Which of these is a C++ access specifier?",
      options: ["private", "mutable", "final", "protected"],
      ans: 0,
      explanation: "private is an access specifier.",
    },
  ],
  // Add other languages as needed
};

// ✅ FLATTEN SELECTED LANGUAGES INTO QUESTION POOL
function buildQuestionPool(languages) {
  let pool = [];
  languages.forEach((lang) => {
    if (questionBank[lang]) pool.push(...questionBank[lang]);
  });
  return pool;
}

// ✅ SHUFFLE ARRAY UTILITY
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ✅ MAIN COMPONENT
export default function TechnicalRound() {
  const navigate = useNavigate();

  const profile = JSON.parse(localStorage.getItem("profile")) || {};
  const selectedLanguages = profile.languages || [];

  const questionPool = buildQuestionPool(selectedLanguages);

  // ✅ PICK 3 UNIQUE QUESTIONS
  const [questions] = useState(() => shuffleArray(questionPool).slice(0, 3));

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showFinalResult, setShowFinalResult] = useState(false);

  const q = questions[index];

  const answer = (i) => {
    if (showAnswer) return;
    setSelected(i);
    setShowAnswer(true);
    if (i === q.ans) setScore((prev) => prev + 1);
  };

  const next = () => {
    if (index === questions.length - 1) {
      const total = questions.length;
      const percentage = Math.round((score / total) * 100);
      const isPassed = percentage >= 40;

      localStorage.setItem("techCorrectAnswers", score);
      localStorage.setItem("techTotalQuestions", total);
      localStorage.setItem("techScore", percentage);
      localStorage.setItem("techPassed", isPassed);

      setShowFinalResult(true);
      return;
    }
    setIndex(index + 1);
    setSelected(null);
    setShowAnswer(false);
  };

  const previous = () => {
    if (index === 0) return;
    setIndex(index - 1);
    setSelected(null);
    setShowAnswer(false);
  };

  if (showFinalResult) {
    const total = questions.length;
    const percentage = Math.round((score / total) * 100);
    const isPassed = percentage >= 40;

    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
        <div className="bg-gray-800 p-8 rounded-xl text-center max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4">Technical Round Result</h1>
          <p className="text-lg mb-2">Score: {score} / {total}</p>
          <p className="text-lg mb-2">Percentage: {percentage}%</p>
          <p className={`font-bold text-xl mb-4 ${isPassed ? "text-green-400" : "text-red-400"}`}>
            {isPassed ? "PASS ✅" : "FAIL ❌"}
          </p>
          <p className="text-sm mb-6 text-gray-300">
            {isPassed
              ? "✅ Minimum 40% criteria met. You can proceed to the next round."
              : "❌ Minimum 40% criteria not met. Please retry this round."}
          </p>
          <button onClick={() => navigate("/dashboard")} className="px-6 py-2 bg-blue-600 rounded-lg">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-xl font-bold mb-4">Technical Round</h1>
      <div className="bg-gray-800 p-6 rounded-xl max-w-xl mx-auto">
        <h3 className="text-lg font-semibold">{q.q}</h3>
        <div className="mt-4 grid gap-3">
          {q.options.map((op, i) => {
            let color = "bg-white/20";
            if (showAnswer) {
              if (i === q.ans) color = "bg-green-600";
              else if (i === selected) color = "bg-red-600";
            }
            return (
              <button key={i} onClick={() => answer(i)} className={`p-3 rounded-lg ${color}`}>
                {op}
              </button>
            );
          })}
        </div>
        {showAnswer && (
          <div className="mt-4 p-3 bg-gray-700 rounded-lg">
            {selected === q.ans ? (
              <p className="text-green-400 font-semibold">✅ Correct Answer!</p>
            ) : (
              <>
                <p className="text-red-400 font-semibold">❌ Your Answer: {q.options[selected]}</p>
                <p className="text-green-400 font-semibold mt-1">✅ Correct Answer: {q.options[q.ans]}</p>
              </>
            )}
            <p className="mt-2 text-gray-300">{q.explanation}</p>
          </div>
        )}
        <div className="flex justify-between mt-6">
          <button onClick={previous} disabled={index === 0} className="px-4 py-2 bg-gray-600 rounded-lg disabled:opacity-40">
            Previous
          </button>
          <button onClick={next} className="px-4 py-2 bg-green-600 rounded-lg">
            {index === questions.length - 1 ? "Finish Test" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
