import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function ReportCard() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

  // ✅ FIXED WARNING (wrapped in microtask)
  useEffect(() => {
    const saved = localStorage.getItem("profile");

    if (saved) {
      Promise.resolve().then(() => {
        setProfile(JSON.parse(saved));
      });
    }
  }, []);

  // Scores
  const aptitudeScore = Number(localStorage.getItem("score")) || 0;
  const correctAnswers = Number(localStorage.getItem("correctAnswers")) || 0;
  const totalQuestions = Number(localStorage.getItem("totalQuestions")) || 0;

  const techPassed = localStorage.getItem("techPassed") === "true";
  const codingScore = Number(localStorage.getItem("codingScore")) || 0;

  const testsAttempted = Number(localStorage.getItem("testsAttempted")) || 0;

  const chartData = [
    {
      name: "Aptitude",
      score: aptitudeScore,
    },
    {
      name: "Technical",
      score: techPassed ? 100 : 0,
    },
    {
      name: "Coding",
      score: codingScore,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-8">

      {/* Header */}
      <h1 className="text-4xl font-bold mb-6 text-center">Student Report Card</h1>

      {/* Profile Card */}
      <div className="max-w-4xl mx-auto bg-white/10 p-6 rounded-2xl shadow-xl backdrop-blur-lg border border-white/10 mb-10 flex gap-6">
        
        {profile?.photo ? (
          <img
            src={profile.photo}
            alt="profile"
            className="w-24 h-24 rounded-full object-cover border border-white/20"
          />
        ) : (
          <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center text-3xl font-bold">
            {profile?.name?.charAt(0)}
          </div>
        )}

        <div>
          <h2 className="text-2xl font-semibold">{profile?.name}</h2>
          <p className="text-gray-300">{profile?.domain || "Student"}</p>
          <p className="text-gray-400 mt-1">
            Tests Attempted: <span className="text-white">{testsAttempted}</span>
          </p>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Aptitude */}
        <div className="bg-white/10 p-5 rounded-2xl border border-white/10 shadow-md">
          <h3 className="text-xl font-bold mb-2">Aptitude</h3>
          <p>Score: {correctAnswers} / {totalQuestions}</p>
          <p className="mt-1 text-gray-300">Percentage: {aptitudeScore}%</p>
        </div>

        {/* Technical */}
        <div className="bg-white/10 p-5 rounded-2xl border border-white/10 shadow-md">
          <h3 className="text-xl font-bold mb-2">Technical</h3>
          <p>Status: {techPassed ? "Passed ✅" : "Not Passed ❌"}</p>
        </div>

        {/* Coding */}
        <div className="bg-white/10 p-5 rounded-2xl border border-white/10 shadow-md">
          <h3 className="text-xl font-bold mb-2">Coding</h3>
          <p>Score: {codingScore || 0} / 100</p>
        </div>

      </div>

      {/* Chart Section */}
      <div className="max-w-4xl mx-auto mt-12 bg-white/10 p-6 rounded-2xl border border-white/10 shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Performance Graph</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#666" />
            <XAxis dataKey="name" stroke="#ddd" />
            <YAxis stroke="#ddd" />
            <Tooltip />
            <Legend />
            <Bar dataKey="score" fill="#8884d8" barSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-center mt-10">
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
