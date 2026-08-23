import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ✅ SHUFFLE ARRAY
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ✅ MAP PROFILE APTITUDE → QUESTION TYPES
function mapProfileToQuestionTypes(profileAptitude) {
  const map = {
    Quantitative: ["percentage", "multiplication", "ratio", "speed_distance", "profit_loss"],
    "Logical Reasoning": ["ratio", "multiplication"],
    Verbal: ["verbal"],
    Puzzles: ["puzzles"],
    "Situational Judgment": ["situational"],
    Communication: ["communication"],
  };

  let types = [];
  profileAptitude.forEach((apt) => {
    if (map[apt]) types.push(...map[apt]);
  });

  return types.length ? types : ["percentage", "multiplication", "ratio"];
}

// ✅ QUESTION BANK
const questionBank = {
  percentage: [
    () => {
      const base = Math.floor(Math.random() * 200) + 50;
      const percent = Math.floor(Math.random() * 30) + 5;
      const answer = Math.round((percent / 100) * base);
      const options = shuffle([answer, answer + 10, answer - 10, answer + 5]).map(String);
      return {
        q: `What is ${percent}% of ${base}?`,
        options,
        ans: answer,
        explanation: `${percent}% of ${base} = ${answer}`,
      };
    },
    () => {
      const base = Math.floor(Math.random() * 300) + 100;
      const percent = Math.floor(Math.random() * 40) + 10;
      const answer = Math.round((percent / 100) * base);
      const options = shuffle([answer, answer + 5, answer - 5, answer + 15]).map(String);
      return {
        q: `Calculate ${percent}% of ${base}.`,
        options,
        ans: answer,
        explanation: `${percent}% of ${base} = ${answer}`,
      };
    },
  ],
  multiplication: [
    () => {
      const a = Math.floor(Math.random() * 20) + 10;
      const b = Math.floor(Math.random() * 20) + 10;
      const answer = a * b;
      const options = shuffle([answer, answer + 10, answer - 10, answer + 20]).map(String);
      return {
        q: `Solve: ${a} × ${b}`,
        options,
        ans: answer,
        explanation: `${a} × ${b} = ${answer}`,
      };
    },
    () => {
      const a = Math.floor(Math.random() * 15) + 5;
      const b = Math.floor(Math.random() * 15) + 5;
      const answer = a * b;
      const options = shuffle([answer, answer + 3, answer - 3, answer + 7]).map(String);
      return {
        q: `Calculate: ${a} × ${b}`,
        options,
        ans: answer,
        explanation: `${a} × ${b} = ${answer}`,
      };
    },
  ],
  ratio: [
    () => {
      const a = Math.floor(Math.random() * 5) + 2;
      const b = Math.floor(Math.random() * 5) + 2;
      const total = 100;
      const ansA = Math.round((a / (a + b)) * total);
      const options = shuffle([ansA, ansA + 10, ansA - 10, total - ansA]).map(String);
      return {
        q: `A ratio ${a}:${b} divides ₹${total}. What is the first share?`,
        options,
        ans: ansA,
        explanation: `First share = (${a}/${a + b}) × ${total} = ${ansA}`,
      };
    },
  ],
  verbal: [
    () => {
      const options = shuffle(["Plentiful", "Scarce", "Empty", "Rare"]);
      return {
        q: "Select the synonym of 'Abundant'.",
        options,
        ans: "Plentiful",
        explanation: "Abundant means Plentiful.",
      };
    },
    () => {
      const options = shuffle(["Rapid", "Slow", "Weak", "Strong"]);
      return {
        q: "Select the antonym of 'Sluggish'.",
        options,
        ans: "Rapid",
        explanation: "Sluggish means slow, so antonym is Rapid.",
      };
    },
  ],
  puzzles: [
    () => {
      const options = shuffle(["🔺", "⬛", "⚪", "⬜"]);
      return {
        q: "Which shape completes the sequence? 🔺 ⬛ 🔺 ⬛ ?",
        options,
        ans: "🔺",
        explanation: "Sequence alternates 🔺 and ⬛, so next is 🔺.",
      };
    },
  ],
  situational: [
    () => {
      const options = shuffle(["Help them", "Ignore", "Report immediately", "Do it yourself"]);
      return {
        q: "If you see a colleague struggling with a task, what should you do?",
        options,
        ans: "Help them",
        explanation: "Correct approach is to offer help in a professional setting.",
      };
    },
  ],
  communication: [
    () => {
      const options = shuffle(["Let's eat, Grandma!", "Lets eat Grandma!", "Lets, eat Grandma!", "Let's eat Grandma"]);
      return {
        q: "Choose the correctly punctuated sentence.",
        options,
        ans: "Let's eat, Grandma!",
        explanation: "The correct punctuation is 'Let's eat, Grandma!'",
      };
    },
  ],
};

// ✅ GENERATE 3 UNIQUE QUESTIONS
function generateUniqueQuestions(activeTypes) {
  let pool = [];
  activeTypes.forEach((type) => {
    pool.push(...questionBank[type].map((fn) => fn()));
  });

  pool = shuffle(pool);

  const uniqueQs = [];
  const usedQs = new Set();

  for (const q of pool) {
    if (!usedQs.has(q.q)) {
      uniqueQs.push(q);
      usedQs.add(q.q);
    }
    if (uniqueQs.length === 3) break;
  }

  return uniqueQs;
}

// ✅ MAIN COMPONENT
export default function AptitudeRound() {
  const navigate = useNavigate();
  const profile = JSON.parse(localStorage.getItem("profile")) || {};
  const selectedAptitude = profile.aptitude || [];
  const activeTypes = mapProfileToQuestionTypes(selectedAptitude);

  const [questions] = useState(() => generateUniqueQuestions(activeTypes));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showFinalResult, setShowFinalResult] = useState(false);

  const q = questions[index];

  useEffect(() => {
    if (showAnswer || showFinalResult) return;
    const t = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setShowAnswer(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [showAnswer, showFinalResult]);

  const answer = (i) => {
    if (showAnswer) return;
    setSelected(i);
    setShowAnswer(true);
    if (q.options[i] === String(q.ans)) setScore((prev) => prev + 1);
  };

  const next = () => {
    if (index === questions.length - 1) {
      const total = questions.length;
      const percentage = Math.round((score / total) * 100);
      localStorage.setItem("correctAnswers", score);
      localStorage.setItem("totalQuestions", total);
      localStorage.setItem("score", percentage);
      localStorage.setItem("testsAttempted", 1);
      setShowFinalResult(true);
      return;
    }
    setIndex(index + 1);
    setTimer(30);
    setSelected(null);
    setShowAnswer(false);
  };

  const previous = () => {
    if (index === 0) return;
    setIndex(index - 1);
    setTimer(30);
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
          <h1 className="text-2xl font-bold mb-4">Aptitude Result</h1>
          <p className="text-lg mb-2">Score: {score} / {total}</p>
          <p className="text-lg mb-2">Percentage: {percentage}%</p>
          <p className={`font-bold text-xl mb-4 ${isPassed ? "text-green-400" : "text-red-400"}`}>
            {isPassed ? "PASS ✅" : "FAIL ❌"}
          </p>
          <button onClick={() => navigate("/dashboard")} className="px-6 py-2 bg-blue-600 rounded-lg">Go to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-xl font-bold mb-4">Aptitude Round</h1>
      <h2 className="mb-2">Time Left: {timer}s</h2>

      <div className="bg-gray-800 p-6 rounded-xl max-w-xl mx-auto">
        <h3 className="text-lg font-semibold">{q.q}</h3>
        <div className="mt-4 grid gap-3">
          {q.options.map((op, i) => {
            let color = "bg-white/20";
            if (showAnswer) {
              if (op === String(q.ans)) color = "bg-green-600";
              else if (i === selected) color = "bg-red-600";
            }
            return (
              <button key={i} onClick={() => answer(i)} className={`p-3 rounded-lg ${color}`}>{op}</button>
            );
          })}
        </div>

        {showAnswer && (
          <div className="mt-4 p-3 bg-gray-700 rounded-lg">
            {q.options[selected] === String(q.ans) ? (
              <p className="text-green-400 font-semibold">✅ Correct Answer!</p>
            ) : (
              <>
                <p className="text-red-400 font-semibold">❌ Your Answer: {q.options[selected]}</p>
                <p className="text-green-400 font-semibold mt-1">✅ Correct Answer: {q.ans}</p>
              </>
            )}
            <p className="mt-2 text-gray-300">{q.explanation}</p>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button onClick={previous} disabled={index === 0} className="px-4 py-2 bg-gray-600 rounded-lg disabled:opacity-40">Previous</button>
          <button onClick={next} className="px-4 py-2 bg-green-600 rounded-lg">{index === questions.length - 1 ? "Finish Test" : "Next"}</button>
        </div>
      </div>
    </div>
  );
}
