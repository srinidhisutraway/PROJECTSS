// src/components/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Animation state
  const [slideIn, setSlideIn] = useState(false);

  // SAFEST animation trigger (no warnings)
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setSlideIn(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const resetProgress = () => {
    localStorage.setItem("score", "0");
    localStorage.setItem("correctAnswers", "0");
    localStorage.setItem("totalQuestions", "0");
    localStorage.setItem("testsAttempted", "0");
    localStorage.setItem("techPassed", "false");
    localStorage.setItem("codingPassed", "false");
    localStorage.setItem("aptitude", JSON.stringify([]));
    localStorage.setItem("attempted", "false");
  };

  const saveProfile = (profileObj) => {
    localStorage.setItem("profile", JSON.stringify(profileObj));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      const raw = localStorage.getItem("profile");
      if (!raw) {
        if (window.confirm("No account found — do you want to sign up instead?")) {
          setIsLogin(false);
        }
        return;
      }

      const saved = JSON.parse(raw);
      if (saved.email.toLowerCase() !== email.toLowerCase()) {
        alert("Incorrect email. Please try again.");
        return;
      }

      const previouslyAttempted =
        localStorage.getItem("attempted") === "true" ||
        Number(localStorage.getItem("testsAttempted") || "0") > 0;

      if (previouslyAttempted) {
        const reattempt = window.confirm(
          "Tests already attempted. Restart all rounds?"
        );

        if (reattempt) {
          resetProgress();
          saveProfile({ ...saved, attempted: false });
          navigate("/aptitude");
          return;
        } else {
          navigate("/dashboard");
          return;
        }
      } else {
        navigate("/dashboard");
        return;
      }
    }

    // SIGNUP
    const displayName = name?.trim() || email.split("@")[0];
    const profileObj = {
      name: displayName,
      email,
      domain: "",
      languages: [],
      aptitude: [],
      goal: "",
      resume: null,
      photo: null,
      attempted: false
    };

    saveProfile(profileObj);
    resetProgress();
    navigate("/profile");
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #03151f 0%, #053040 40%, #04556b 100%)",
      }}
    >
      {/* SHINY TEAL GLOW STRIPS */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[120%] h-[120%] -left-20 -top-20 opacity-20 rotate-12 
          bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-3xl"></div>
        <div className="absolute w-[140%] h-[140%] right-0 bottom-0 opacity-10 -rotate-12 
          bg-gradient-to-r from-transparent via-teal-300 to-transparent blur-2xl"></div>
      </div>

      {/* LEFT SIDE TEXT WITH SLIDE-IN ANIMATION */}
      <div
        className={`
          hidden md:block w-1/2 text-left text-white pl-20 pr-6
          transform transition-all duration-700 ease-out
          ${slideIn ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"}
        `}
      >
        <h1 className="text-3xl font-bold tracking-wide drop-shadow-2xl mb-4">
          MOCK INTERVIEW PLATFORM
        </h1>

        <p className="mt-4 text-lg text-gray-300 max-w-xl leading-relaxed pl-1">
          Prepare for success with realistic aptitude, tech, and coding interview
          rounds — all in one place.
        </p>
      </div>

      {/* LOGIN CARD */}
      <div className="backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl 
        w-full max-w-sm rounded-2xl p-8 relative z-10">

        <h1 className="text-3xl font-bold text-white text-center mb-4">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>

        <p className="text-center text-gray-300 mb-6">
          {isLogin ? "Login to continue" : "Sign up to get started"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/10 text-gray-100 placeholder-gray-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-white/10 text-gray-100 placeholder-gray-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-white/10 text-gray-100 placeholder-gray-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
          />

          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full bg-white/10 text-gray-100 placeholder-gray-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-teal-500 text-white font-semibold 
            shadow-lg hover:bg-teal-600 hover:scale-[1.02] transition duration-200"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-300 mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setEmail("");
              setPassword("");
              setName("");
            }}
            className="text-teal-300 underline hover:text-teal-200"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
