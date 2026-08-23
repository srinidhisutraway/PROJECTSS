import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileSetup() {
  const navigate = useNavigate();

  const domains = [
    "Computer Science", "Electronics", "Electrical", "Mechanical", "Civil",
    "Information Technology", "Data Science", "AI & ML", "Cybersecurity", "Other",
  ];

  const languages = [
    "JavaScript", "Python", "Java", "C++", "C",
    "Go", "Rust", "Kotlin", "Swift", "PHP",
  ];

  const aptitude = [
    "Quantitative", "Logical Reasoning", "Verbal",
    "Puzzles", "Situational Judgment", "Communication",
  ];

  const [form, setForm] = useState({
    name: "",
    photo: null,
    domain: "",
    languages: [],
    aptitude: [],
    goal: "",
    resume: null,
  });

  const [preview, setPreview] = useState(null);

  function toggleSelection(key, value) {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  }

  function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, photo: file });
      setPreview(URL.createObjectURL(file));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    const profileData = {
      name: form.name,
      domain: form.domain,
      languages: form.languages,
      aptitude: form.aptitude,
      goal: form.goal,
      resume: form.resume ? form.resume.name : null,
      photo: form.photo ? URL.createObjectURL(form.photo) : null,
    };

    localStorage.setItem("profile", JSON.stringify(profileData));

    alert("Profile Saved!");
    navigate("/dashboard");
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(135deg, #022C35, #05414D, #075E6E)",
      }}
    >
      {/* FORM CARD WITH PURE CSS ANIMATION */}
      <form
        onSubmit={handleSubmit}
        className="
          w-full max-w-xl p-8 rounded-2xl shadow-2xl border border-white/30
          backdrop-blur-xl bg-white/10 
          animate-slideUpFade
        "
      >
        <h2 className="text-3xl font-extrabold text-white text-center mb-2 drop-shadow-lg">
          Profile Setup
        </h2>
        <p className="text-center text-white mb-6 opacity-80">
          Help us personalize your mock interview experience
        </p>

        {/* NAME */}
        <div>
          <label className="text-white text-sm">Your Name</label>
          <input
            type="text"
            className="w-full bg-transparent text-white rounded-lg p-3 mt-2 border border-white/50 placeholder-white/50"
            placeholder="Enter your name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        {/* PHOTO */}
        <div className="mt-4">
          <label className="text-white text-sm">Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            className="w-full bg-transparent text-white rounded-lg p-2 mt-2 border border-white/50"
            onChange={handlePhotoUpload}
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 rounded-full mt-3 border-2 border-white object-cover shadow-lg"
            />
          )}
        </div>

        {/* DOMAIN */}
        <div className="mt-4">
          <label className="text-white text-sm">Your Engineering Domain</label>
          <select
            className="w-full bg-transparent text-white p-3 mt-2 rounded-lg border border-white/50"
            onChange={(e) => setForm({ ...form, domain: e.target.value })}
          >
            <option value="" className="text-black">
              Select your domain
            </option>
            {domains.map((d) => (
              <option key={d} value={d} className="text-black">
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* LANGUAGES */}
        <div className="mt-4">
          <label className="text-white text-sm">Programming Languages</label>
          <div className="flex flex-wrap gap-3 mt-2">
            {languages.map((l) => (
              <label key={l} className="flex items-center gap-2 text-white text-sm">
                <input
                  type="checkbox"
                  checked={form.languages.includes(l)}
                  onChange={() => toggleSelection("languages", l)}
                />
                {l}
              </label>
            ))}
          </div>
        </div>

        {/* APTITUDE */}
        <div className="mt-4">
          <label className="text-white text-sm">Aptitude Areas</label>
          <div className="flex flex-wrap gap-3 mt-2">
            {aptitude.map((a) => (
              <label key={a} className="flex items-center gap-2 text-white text-sm">
                <input
                  type="checkbox"
                  checked={form.aptitude.includes(a)}
                  onChange={() => toggleSelection("aptitude", a)}
                />
                {a}
              </label>
            ))}
          </div>
        </div>

        {/* GOAL */}
        <div className="mt-4">
          <label className="text-white text-sm">Your Goal</label>
          <textarea
            rows="3"
            className="w-full bg-transparent text-white rounded-lg p-3 mt-2 border border-white/50 placeholder-white/50"
            placeholder="Describe your career goal..."
            onChange={(e) => setForm({ ...form, goal: e.target.value })}
          ></textarea>
        </div>

        {/* RESUME */}
        <div className="mt-4">
          <label className="text-white text-sm">Upload Resume</label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="w-full bg-transparent text-white rounded-lg p-2 mt-2 border border-white/50"
            onChange={(e) => setForm({ ...form, resume: e.target.files[0] })}
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="
            w-full py-3 mt-6 rounded-xl border border-white text-white font-bold 
            shadow-xl bg-transparent hover:bg-white hover:text-black transition
          "
        >
          Save & Continue
        </button>
      </form>

      {/* ANIMATION CSS */}
      <style>
        {`
          @keyframes slideUpFade {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-slideUpFade {
            animation: slideUpFade 0.8s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
}
