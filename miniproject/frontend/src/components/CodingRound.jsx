import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// ▶ CODING QUESTIONS
const codingQuestions = [
  {
    title: "Reverse a String",
    description: "Write a program to reverse a given string.",
    sampleInput: "hello",
    sampleOutput: "olleh",
  },
  {
    title: "Find Even Numbers",
    description: "Print all even numbers from 1 to N.",
    sampleInput: "10",
    sampleOutput: "2 4 6 8 10",
  },
  {
    title: "Factorial of a Number",
    description: "Find the factorial of a number N.",
    sampleInput: "5",
    sampleOutput: "120",
  },
];

export default function CodingRound() {
  const navigate = useNavigate();

  const [questionIndex, setQuestionIndex] = useState(0);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// Write your code here\n");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const q = codingQuestions[questionIndex];

  // ▶ RUN CODE
  const runCode = async () => {
    setLoading(true);
    setOutput("");
    setIsCorrect(false);

    try {
      const res = await fetch("http://localhost:5000/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          code,
        }),
      });

      const data = await res.json();
      const userOutput = (data.output || "").trim();
      const expected = q.sampleOutput.trim();

      setOutput(userOutput);

      // ✔ Check correctness
      setIsCorrect(userOutput === expected);
    } catch {
      setOutput("❌ Backend Connection Failed");
    }

    setLoading(false);
  };

  // ▶ NEXT QUESTION
  const nextQuestion = () => {
    if (!isCorrect) {
      alert("❌ Please solve correctly before moving to next question!");
      return;
    }

    if (questionIndex === codingQuestions.length - 1) {
      localStorage.setItem("codingPassed", "true");
      alert("🎉 Coding Round Completed Successfully!");
      navigate("/dashboard");
    } else {
      setQuestionIndex((prev) => prev + 1);
      setCode("// Write your code here\n");
      setOutput("");
      setIsCorrect(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-5xl mx-auto bg-gray-800 p-6 rounded-xl">

        <h1 className="text-2xl font-bold mb-4">💻 Coding Round</h1>

        {/* QUESTION BOX */}
        <div className="bg-gray-700 p-4 rounded mb-4">
          <h2 className="text-xl font-semibold mb-1">{q.title}</h2>
          <p className="text-sm mb-2">{q.description}</p>

          <p className="text-xs text-gray-300">
            Input: <b>{q.sampleInput}</b> | Expected Output: <b>{q.sampleOutput}</b>
          </p>
        </div>

        {/* LANGUAGE DROPDOWN */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="mb-4 p-2 bg-gray-900 border border-gray-700 rounded"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
        </select>

        {/* CODE EDITOR */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={12}
          className="w-full p-3 bg-black text-green-400 font-mono rounded mb-4"
        />

        {/* BUTTONS */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={runCode}
            className="px-5 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            {loading ? "Running..." : "▶ Run Code"}
          </button>

          <button
            onClick={nextQuestion}
            className={`px-5 py-2 rounded ${
              isCorrect
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-600 cursor-not-allowed"
            }`}
          >
            {questionIndex === codingQuestions.length - 1
              ? "Finish Round"
              : "Next Question"}
          </button>
        </div>

        {/* OUTPUT BOX */}
        <div className="bg-black p-3 rounded text-green-400 min-h-[80px]">
          {output || "Output will appear here..."}
        </div>

        {/* RESULT MESSAGE */}
        {output && (
          <div
            className={`mt-3 font-bold ${
              isCorrect ? "text-green-400" : "text-red-400"
            }`}
          >
            {isCorrect ? "✅ Correct Answer!" : "❌ Wrong Answer. Try Again!"}
          </div>
        )}
      </div>
    </div>
  );
}
