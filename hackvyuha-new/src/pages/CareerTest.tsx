import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Check, Lightbulb, Award, Briefcase, BookOpen } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  type: 'scale' | 'multiple' | 'freetext';
  options?: string[];
  category: 'interests' | 'skills' | 'personality' | 'values';
}

interface Answer {
  questionId: number;
  answer: string | number | string[];
}

const questions: Question[] = [
  // Interests
  {
    id: 1,
    text: "How interested are you in solving complex technical problems?",
    type: "scale",
    category: "interests"
  },
  {
    id: 2,
    text: "Which of these activities would you most enjoy doing?",
    type: "multiple",
    options: [
      "Analyzing data and discovering patterns",
      "Designing creative visuals and user experiences",
      "Managing projects and coordinating people",
      "Writing and communicating ideas",
      "Building or fixing things with your hands"
    ],
    category: "interests"
  },
  {
    id: 3,
    text: "What type of environments do you prefer working in?",
    type: "multiple",
    options: [
      "Fast-paced startup environment",
      "Structured corporate setting",
      "Creative studio or agency",
      "Research-focused organization",
      "Remote/flexible work arrangement"
    ],
    category: "interests"
  },
  
  // Skills
  {
    id: 4,
    text: "Rate your analytical and problem-solving abilities:",
    type: "scale",
    category: "skills"
  },
  {
    id: 5,
    text: "Which of these skills do you believe are your strongest?",
    type: "multiple",
    options: [
      "Technical skills (coding, data analysis, etc.)",
      "Creative skills (design, writing, etc.)",
      "Communication and interpersonal skills",
      "Organization and planning skills",
      "Leadership and management skills"
    ],
    category: "skills"
  },
  {
    id: 6,
    text: "Describe a project or achievement you're particularly proud of:",
    type: "freetext",
    category: "skills"
  },
  
  // Personality
  {
    id: 7,
    text: "How comfortable are you working independently with minimal supervision?",
    type: "scale",
    category: "personality"
  },
  {
    id: 8,
    text: "In a team setting, which role do you typically take on?",
    type: "multiple",
    options: [
      "Leader who directs the team",
      "Innovator who generates ideas",
      "Mediator who helps resolve conflicts",
      "Implementer who gets things done",
      "Analyzer who evaluates options critically"
    ],
    category: "personality"
  },
  {
    id: 9,
    text: "How do you typically approach deadlines and time management?",
    type: "multiple",
    options: [
      "I work steadily and methodically, planning well in advance",
      "I tend to work in bursts of productivity when inspired",
      "I work best under pressure, often close to deadlines",
      "I'm very organized and create detailed schedules",
      "I'm flexible and adapt my approach based on the situation"
    ],
    category: "personality"
  },
  
  // Values
  {
    id: 10,
    text: "How important is work-life balance to you?",
    type: "scale",
    category: "values"
  },
  {
    id: 11,
    text: "What motivates you most in your career?",
    type: "multiple",
    options: [
      "Financial success and stability",
      "Making a positive impact on society",
      "Continuous learning and growth",
      "Recognition and advancement",
      "Creative fulfillment and expression"
    ],
    category: "values"
  },
  {
    id: 12,
    text: "What are your long-term career goals or aspirations?",
    type: "freetext",
    category: "values"
  }
];

const CareerTest: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [results, setResults] = useState<any>(null);
  
  const isFirstQuestion = currentStep === 0;
  const isLastQuestion = currentStep === questions.length - 1;
  const isIntroScreen = currentStep === -1;
  const showResults = currentStep === questions.length;
  
  const handleAnswer = (answer: string | number | string[]) => {
    const currentQuestion = questions[currentStep];
    
    const newAnswer = {
      questionId: currentQuestion.id,
      answer
    };
    
    // Update or add answer
    const answerIndex = answers.findIndex(a => a.questionId === currentQuestion.id);
    if (answerIndex >= 0) {
      const newAnswers = [...answers];
      newAnswers[answerIndex] = newAnswer;
      setAnswers(newAnswers);
    } else {
      setAnswers([...answers, newAnswer]);
    }
  };
  
  const handleNextQuestion = () => {
    // Only proceed if current question is answered
    const currentQuestion = questions[currentStep];
    const isAnswered = answers.some(a => a.questionId === currentQuestion.id);
    
    if (isAnswered) {
      if (isLastQuestion) {
        handleSubmitTest();
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };
  
  const handlePrevQuestion = () => {
    setCurrentStep(prev => prev - 1);
  };
  
  const getCurrentAnswer = () => {
    const currentQuestion = questions[currentStep];
    return answers.find(a => a.questionId === currentQuestion.id)?.answer;
  };
  
  const handleSubmitTest = () => {
    // Move to results screen
    setCurrentStep(questions.length);
    
    // Simulate API call for results
    setTimeout(() => {
      // This would be replaced with actual AI analysis
      setResults({
        topCareerMatches: [
          {
            title: "Software Developer",
            matchScore: 92,
            description: "Software developers design, build, and maintain computer programs and applications. They work in diverse fields like web development, mobile apps, and enterprise software.",
            skills: ["Programming", "Problem Solving", "Logical Thinking", "Attention to Detail"],
            learningPath: "Start with foundational programming courses, then specialize in web, mobile, or specific domains like AI or data science.",
            certifications: ["AWS Certified Developer", "Microsoft Certified: Azure Developer", "Google Associate Android Developer"]
          },
          {
            title: "UX/UI Designer",
            matchScore: 85,
            description: "UX/UI designers create user-friendly and visually appealing digital experiences. They combine creativity with user research to design intuitive interfaces.",
            skills: ["Visual Design", "User Empathy", "Prototyping", "Research"],
            learningPath: "Learn fundamentals of design, user research methods, and prototyping tools. Build a portfolio of projects.",
            certifications: ["Certified User Experience Professional", "Adobe Certified Professional", "Google UX Design Certificate"]
          },
          {
            title: "Data Analyst",
            matchScore: 78,
            description: "Data analysts collect, process, and analyze data to help organizations make better decisions. They work across industries to extract meaningful insights from complex datasets.",
            skills: ["Statistics", "SQL", "Data Visualization", "Critical Thinking"],
            learningPath: "Focus on statistics, database querying, and data visualization tools. Practice with real-world datasets.",
            certifications: ["Google Data Analytics Certificate", "Microsoft Certified: Data Analyst Associate", "IBM Data Analyst Professional Certificate"]
          }
        ],
        skillAnalysis: {
          strengths: ["Technical problem-solving", "Creativity", "Analytical thinking"],
          areasForGrowth: ["Project management", "Public speaking", "Team leadership"],
          recommendations: [
            "Focus on developing project management skills through online courses or small team projects",
            "Join Toastmasters or similar groups to improve public speaking abilities",
            "Seek opportunities to lead small teams or initiatives to build leadership experience"
          ]
        },
        personalityInsights: [
          "You thrive in environments that balance structure with creative freedom",
          "You prefer collaborative work with opportunities for independent contribution",
          "You value learning and continuous growth in your professional life",
          "You approach problems methodically but also appreciate innovative solutions"
        ],
        suggestedCompanies: [
          {
            name: "Tech Innovators Inc.",
            industry: "Technology",
            culture: "Collaborative and innovation-focused",
            description: "Medium-sized tech company with emphasis on work-life balance and professional development"
          },
          {
            name: "Creative Solutions Group",
            industry: "Digital Agency",
            culture: "Fast-paced and creative",
            description: "Agency working with diverse clients on challenging digital projects"
          },
          {
            name: "Data Insights Partners",
            industry: "Data Analytics",
            culture: "Research-oriented and detail-focused",
            description: "Specializes in transforming complex data into actionable business intelligence"
          }
        ]
      });
    }, 1500);
  };
  
  const renderTestQuestion = () => {
    if (isIntroScreen) {
      return (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Welcome to the Career Assistance Test</h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            This test will help identify your strengths, interests, and values to recommend suitable career paths.
            The test takes about 5-10 minutes to complete.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 max-w-2xl mx-auto text-left">
            <h3 className="text-lg font-medium text-blue-800 mb-2">How it works:</h3>
            <ul className="space-y-2 text-blue-700">
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>Answer questions about your interests, skills, personality, and values</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>Our AI analyzes your responses to identify career matches</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>Review personalized career recommendations and learning paths</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>Get actionable insights to help guide your career decisions</span>
              </li>
            </ul>
          </div>
          
          <button
            onClick={() => setCurrentStep(0)}
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            Start the Test <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      );
    }
    
    if (showResults) {
      if (!results) {
        return (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-slate-700">Analyzing your responses...</p>
          </div>
        );
      }
      
      return (
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Your Career Insights</h2>
          
          {/* Top Career Matches */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
              Top Career Matches
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {results.topCareerMatches.map((career: any, index: number) => (
                <div key={index} className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-3 px-4 text-white">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-lg">{career.title}</h4>
                      <span className="bg-white text-blue-700 text-sm font-bold rounded-full px-2 py-1">
                        {career.matchScore}% Match
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <p className="text-slate-600 text-sm mb-3">{career.description}</p>
                    
                    <div className="mb-3">
                      <h5 className="text-sm font-medium text-slate-900 mb-1">Key Skills</h5>
                      <div className="flex flex-wrap gap-1">
                        {career.skills.map((skill: string, skillIndex: number) => (
                          <span key={skillIndex} className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-1">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <h5 className="text-sm font-medium text-slate-900 mb-1">Learning Path</h5>
                      <p className="text-xs text-slate-600">{career.learningPath}</p>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-slate-900 mb-1">Recommended Certifications</h5>
                      <ul className="text-xs text-slate-600 list-disc pl-4 space-y-0.5">
                        {career.certifications.map((cert: string, certIndex: number) => (
                          <li key={certIndex}>{cert}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Skills Analysis */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
              <Award className="h-5 w-5 mr-2 text-amber-600" />
              Skills Assessment
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <h4 className="font-medium text-slate-900 mb-2">Strengths</h4>
                <ul className="space-y-1">
                  {results.skillAnalysis.strengths.map((strength: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span className="text-slate-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <h4 className="font-medium text-slate-900 mb-2">Areas for Growth</h4>
                <ul className="space-y-1">
                  {results.skillAnalysis.areasForGrowth.map((area: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <ArrowRight className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                      <span className="text-slate-700">{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mt-4 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <h4 className="font-medium text-slate-900 mb-2">Skill Development Recommendations</h4>
              <ul className="space-y-2">
                {results.skillAnalysis.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <Lightbulb className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                    <span className="text-slate-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Personality Insights */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-teal-600" />
              Personality Insights
            </h3>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.personalityInsights.map((insight: string, index: number) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-teal-100 text-teal-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-slate-700">{insight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Suggested Companies */}
          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-purple-600" />
              Company Culture Matches
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {results.suggestedCompanies.map((company: any, index: number) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                  <h4 className="font-medium text-slate-900 mb-1">{company.name}</h4>
                  <div className="text-sm text-purple-700 mb-2">{company.industry}</div>
                  <div className="mb-2">
                    <span className="text-xs bg-purple-100 text-purple-800 rounded-full px-2 py-1">
                      {company.culture}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{company.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-10 text-center">
            <button
              onClick={() => setCurrentStep(-1)}
              className="inline-flex items-center px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              Retake Test
            </button>
          </div>
        </div>
      );
    }
    
    const currentQuestion = questions[currentStep];
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-slate-500">
            Question {currentStep + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 capitalize">
            {currentQuestion.category}
          </span>
        </div>
        
        <h3 className="text-xl font-semibold text-slate-900 mb-6">{currentQuestion.text}</h3>
        
        {currentQuestion.type === 'scale' && (
          <div className="mb-8">
            <div className="flex justify-between text-sm text-slate-600 mb-2">
              <span>Not at all</span>
              <span>Extremely</span>
            </div>
            <div className="flex justify-between space-x-2">
              {[1, 2, 3, 4, 5].map(value => (
                <button
                  key={value}
                  onClick={() => handleAnswer(value)}
                  className={`
                    flex-1 py-3 rounded-lg transition-colors
                    ${getCurrentAnswer() === value 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}
                  `}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {currentQuestion.type === 'multiple' && currentQuestion.options && (
          <div className="mb-8 space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className={`
                  w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center
                  ${getCurrentAnswer() === option 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-800'}
                `}
              >
                {getCurrentAnswer() === option && (
                  <Check className="h-5 w-5 mr-2 flex-shrink-0" />
                )}
                <span>{option}</span>
              </button>
            ))}
          </div>
        )}
        
        {currentQuestion.type === 'freetext' && (
          <div className="mb-8">
            <textarea
              value={getCurrentAnswer() as string || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              rows={5}
              placeholder="Type your answer here..."
            ></textarea>
          </div>
        )}
        
        <div className="flex justify-between">
          <button
            onClick={handlePrevQuestion}
            disabled={isFirstQuestion}
            className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors
              ${isFirstQuestion 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-slate-200 hover:bg-slate-300 text-slate-800'}
            `}
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Previous
          </button>
          
          <button
            onClick={handleNextQuestion}
            disabled={!getCurrentAnswer()}
            className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors
              ${!getCurrentAnswer() 
                ? 'bg-blue-300 text-white cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'}
            `}
          >
            {isLastQuestion ? 'Submit' : 'Next'}
            <ArrowRight className="h-5 w-5 ml-1" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 sm:p-8">
            {renderTestQuestion()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerTest;