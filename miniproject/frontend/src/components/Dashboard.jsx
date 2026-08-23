import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load Profile
  useEffect(() => {
    const saved = localStorage.getItem("profile");

    if (!saved) {
      setLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(saved);

      if (parsed && typeof parsed === "object") {
        setProfile({
          name: parsed.name || "",
          domain: parsed.domain || "",
          languages: Array.isArray(parsed.languages) ? parsed.languages : [],
          aptitude: Array.isArray(parsed.aptitude) ? parsed.aptitude : [],
          goal: parsed.goal || "",
          resume: parsed.resume || null,
          photo: parsed.photo || null,
        });
      }
    } catch (err) {
      console.error("Invalid profile:", err);
    }

    setLoading(false);
  }, []);

  if (loading) {
    return <p className="text-white text-center mt-10">Loading...</p>;
  }

  if (!profile || !profile.name) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl mb-4">No Profile Found</h1>
        <button
          onClick={() => navigate("/profile")}
          className="px-5 py-2 bg-blue-600 rounded-lg"
        >
          Create Profile
        </button>
      </div>
    );
  }

  // Read results
  const aptitudeScore = Number(localStorage.getItem("score")) || 0;
  const correctAnswers = Number(localStorage.getItem("correctAnswers")) || 0;
  const totalQuestions = Number(localStorage.getItem("totalQuestions")) || 0;
  const testsAttempted = Number(localStorage.getItem("testsAttempted")) || 0;

  const techPassed = localStorage.getItem("techPassed") === "true";
  const isAptitudePassed = aptitudeScore >= 40;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-black to-gray-800 text-white p-6 flex gap-6">

      {/* SIDEBAR */}
      <aside className="w-80 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl space-y-6 h-fit">

        {/* PROFILE */}
        <div className="flex items-center gap-4">
          {profile.photo ? (
            <img
              src={profile.photo}
              alt="profile"
              className="w-14 h-14 rounded-full object-cover"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-purple-500 flex items-center justify-center text-xl font-bold">
              {profile.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h2 className="font-semibold text-lg">{profile.name}</h2>
            <p className="text-sm text-gray-300">{profile.domain || "Student"}</p>
          </div>
        </div>

        {/* STATS */}
        <div className="space-y-3">

          <div className="p-3 bg-white/5 rounded-lg">
            <div className="text-sm text-gray-400">Aptitude Result</div>

            <div className="text-lg font-semibold">
              {correctAnswers} / {totalQuestions}
            </div>

            <div className="text-sm text-gray-400 mt-1">
              Percentage: {aptitudeScore}%
            </div>

            <div
              className={`text-sm mt-1 font-bold ${
                aptitudeScore === 0
                  ? "text-yellow-400"
                  : isAptitudePassed
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {aptitudeScore === 0
                ? "NOT ATTEMPTED"
                : isAptitudePassed
                ? "PASS ✅"
                : "FAIL ❌"}
            </div>
          </div>

          <div className="p-3 bg-white/5 rounded-lg">
            <div className="text-sm text-gray-400">Tests Attempted</div>
            <div className="text-lg font-semibold">{testsAttempted}</div>
          </div>

        </div>

        <button
          onClick={() => navigate("/profile")}
          className="w-full py-2 rounded-lg bg-white/20 hover:bg-white/30"
        >
          Edit Profile
        </button>
      </aside>

      {/* MAIN */}
      <main className="flex-1 bg-white/10 rounded-2xl p-8 border border-white/10">
        <h1 className="text-3xl font-bold mb-8">Your Journey</h1>

        <div className="space-y-12">

          {/* Aptitude */}
          <div
            onClick={() => navigate("/aptitude")}
            className="flex gap-6 items-center cursor-pointer transform transition hover:scale-105"
          >
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
              1
            </div>
            <div>
              <h2 className="text-xl font-semibold">Aptitude Round</h2>
              <p className="text-gray-300 text-sm">Logical & Quantitative Test</p>
            </div>
          </div>

          {/* Technical */}
          <div
            onClick={() => isAptitudePassed && navigate("/technical")}
            className={`flex gap-6 items-center transform transition ${
              isAptitudePassed
                ? "cursor-pointer hover:scale-105"
                : "opacity-40 cursor-not-allowed"
            }`}
          >
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-xl font-bold">
              2
            </div>
            <div>
              <h2 className="text-xl font-semibold">Technical Round</h2>
              {!isAptitudePassed && (
                <p className="text-red-400 text-xs">Unlocks at 40%</p>
              )}
            </div>
          </div>

          {/* Coding */}
          <div
            onClick={() => techPassed && navigate("/coding")}
            className={`flex gap-6 items-center transform transition ${
              techPassed
                ? "cursor-pointer hover:scale-105"
                : "opacity-40 cursor-not-allowed"
            }`}
          >
            <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center text-xl font-bold">
              3
            </div>
            <div>
              <h2 className="text-xl font-semibold">Coding Round</h2>
              {!techPassed && (
                <p className="text-red-400 text-xs">
                  Unlocks after passing Technical Round
                </p>
              )}
            </div>
          </div>

          {/* REPORT CARD BUTTON */}
          <div className="flex justify-center pt-10">
            <button
              onClick={() => navigate("/report")}
              className="px-8 py-4 bg-blue-500 text-white text-lg rounded-xl shadow-lg hover:scale-105 transition font-semibold"
            >
              📄 View Report Card
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
