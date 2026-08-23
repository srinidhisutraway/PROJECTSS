import React, { useState } from "react";

export default function AuthPage() {
  const languages = [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "C#",
    "C++",
    "C",
    "Go",
    "Rust",
    "Ruby",
    "PHP",
    "Swift",
    "Kotlin",
    "Scala",
    "SQL",
    "R",
    "MATLAB",
    "Dart",
    "Perl",
    "Shell"
  ];

  const [tab, setTab] = useState("signup");

  // Signup state
  const [signup, setSignup] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    languages: [],
    otherLanguage: "",
    experience: "0-1",
    timezone: "",
    linkedin: "",
    bio: "",
    agreeTOS: false
  });

  // Login state
  const [login, setLogin] = useState({ email: "", password: "", remember: false });

  function toggleLanguage(lang) {
    setSignup((s) => {
      const has = s.languages.includes(lang);
      return { ...s, languages: has ? s.languages.filter((l) => l !== lang) : [...s.languages, lang] };
    });
  }

  function handleSignupSubmit(e) {
    e.preventDefault();
    // Basic client-side validation
    if (!signup.name || !signup.email || !signup.password) {
      alert("Please fill name, email and password.");
      return;
    }
    if (signup.password !== signup.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!signup.agreeTOS) {
      alert("Please agree to terms");
      return;
    }

    // TODO: send to backend. For now print to console
    console.log("SIGNUP payload:", signup);
    alert("Signup submitted (check console). This is a mock — wire to your backend API.");
  }

  function handleLoginSubmit(e) {
    e.preventDefault();
    if (!login.email || !login.password) {
      alert("Please enter email & password");
      return;
    }
    // TODO: call backend
    console.log("LOGIN payload:", login);
    alert("Login submitted (check console). This is a mock — wire to your backend API.");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="p-8 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white">
          <h1 className="text-3xl font-bold">MockInterview</h1>
          <p className="mt-4 text-sm opacity-90">Practice live interviews, get feedback, and land offers. Create an account or sign in to continue.</p>

          <div className="mt-8 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white bg-opacity-10 rounded-full flex items-center justify-center">🎯</div>
              <div>
                <div className="text-xs uppercase opacity-80">Feature</div>
                <div className="text-sm font-semibold">Live paired interviews</div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white bg-opacity-10 rounded-full flex items-center justify-center">🧑‍🏫</div>
              <div>
                <div className="text-xs uppercase opacity-80">Feature</div>
                <div className="text-sm font-semibold">Personalized feedback</div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white bg-opacity-10 rounded-full flex items-center justify-center">📚</div>
              <div>
                <div className="text-xs uppercase opacity-80">Feature</div>
                <div className="text-sm font-semibold">Curated practice problems</div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex space-x-2">
              <button
                onClick={() => setTab("signup")}
                className={`px-3 py-1 rounded-full font-medium ${tab === "signup" ? "bg-white text-indigo-700" : "bg-white bg-opacity-20"}`}>
                Create account
              </button>
              <button
                onClick={() => setTab("login")}
                className={`px-3 py-1 rounded-full font-medium ${tab === "login" ? "bg-white text-indigo-700" : "bg-white bg-opacity-20"}`}>
                Sign in
              </button>
            </div>
          </div>
        </div>

        <div className="p-8">
          {tab === "signup" ? (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <h2 className="text-2xl font-semibold">Create your account</h2>

              <div>
                <label className="block text-sm font-medium">Full name</label>
                <input
                  value={signup.name}
                  onChange={(e) => setSignup({ ...signup, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2"
                  placeholder="Jane Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={signup.email}
                  onChange={(e) => setSignup({ ...signup, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2"
                  placeholder="you@domain.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Password</label>
                  <input
                    type="password"
                    value={signup.password}
                    onChange={(e) => setSignup({ ...signup, password: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2"
                    placeholder="Choose a strong password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Confirm password</label>
                  <input
                    type="password"
                    value={signup.confirmPassword}
                    onChange={(e) => setSignup({ ...signup, confirmPassword: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2"
                    placeholder="Confirm password"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">Type of account</label>
                <select
                  value={signup.role}
                  onChange={(e) => setSignup({ ...signup, role: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2"
                >
                  <option value="student">Student / Candidate</option>
                  <option value="interviewer">Interviewer</option>
                  <option value="mentor">Mentor</option>
                  <option value="recruiter">Recruiter</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium">Programming languages (select any)</label>
                  <div className="text-xs opacity-70">Selected: {signup.languages.length}</div>
                </div>

                <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-auto">
                  {languages.map((lang) => (
                    <button
                      type="button"
                      key={lang}
                      onClick={() => toggleLanguage(lang)}
                      className={`text-sm rounded-md px-2 py-1 border ${signup.languages.includes(lang) ? "bg-indigo-600 text-white border-indigo-600" : "bg-white"}`}>
                      {lang}
                    </button>
                  ))}

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={signup.languages.includes("Other")}
                      onChange={() => toggleLanguage("Other")}
                    />
                    <span className="text-sm">Other</span>
                  </label>
                </div>

                {signup.languages.includes("Other") && (
                  <input
                    className="mt-2 block w-full rounded-md border-gray-200 shadow-sm p-2"
                    placeholder="Enter other language"
                    value={signup.otherLanguage}
                    onChange={(e) => setSignup({ ...signup, otherLanguage: e.target.value })}
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Experience level</label>
                  <select
                    value={signup.experience}
                    onChange={(e) => setSignup({ ...signup, experience: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2"
                  >
                    <option value="0-1">0-1 years</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5+">5+ years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium">Timezone / Availability</label>
                  <input
                    value={signup.timezone}
                    onChange={(e) => setSignup({ ...signup, timezone: e.target.value })}
                    placeholder="e.g. UTC+5:30, Weeknights"
                    className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">LinkedIn profile (optional)</label>
                <input
                  value={signup.linkedin}
                  onChange={(e) => setSignup({ ...signup, linkedin: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2"
                  placeholder="https://linkedin.com/in/yourname"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Short bio / goals</label>
                <textarea
                  value={signup.bio}
                  onChange={(e) => setSignup({ ...signup, bio: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2"
                  rows={3}
                  placeholder="Tell us what you're preparing for (e.g. frontend role at FAANG, data science interviews, etc.)"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={signup.agreeTOS}
                  onChange={(e) => setSignup({ ...signup, agreeTOS: e.target.checked })}
                />
                <div className="text-sm">I agree to the <span className="underline">terms</span> and <span className="underline">privacy policy</span></div>
              </div>

              <div className="flex items-center justify-between">
                <button className="px-4 py-2 rounded-md bg-indigo-600 text-white font-medium">Create account</button>
                <div className="text-sm opacity-80">Already have an account? <button type="button" onClick={() => setTab("login")} className="underline">Sign in</button></div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <h2 className="text-2xl font-semibold">Sign in</h2>

              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={login.email}
                  onChange={(e) => setLogin({ ...login, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Password</label>
                <input
                  type="password"
                  value={login.password}
                  onChange={(e) => setLogin({ ...login, password: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" checked={login.remember} onChange={(e) => setLogin({ ...login, remember: e.target.checked })} />
                  <span>Remember me</span>
                </label>
                <button type="button" className="text-sm underline">Forgot password?</button>
              </div>

              <button className="w-full px-4 py-2 rounded-md bg-indigo-600 text-white font-medium">Sign in</button>

              <div className="text-center text-sm opacity-80">Or sign in with</div>
              <div className="flex gap-2">
                <button type="button" className="flex-1 px-2 py-2 rounded-md border">Continue with Google</button>
                <button type="button" className="flex-1 px-2 py-2 rounded-md border">Continue with GitHub</button>
              </div>

              <div className="text-sm text-center">New? <button type="button" onClick={() => setTab("signup")} className="underline">Create an account</button></div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
