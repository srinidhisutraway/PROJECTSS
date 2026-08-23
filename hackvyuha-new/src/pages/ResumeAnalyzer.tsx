import React, { useState } from 'react';
import { Upload, FileWarning, FileCheck, Search, AlertTriangle, Eye, Download } from 'lucide-react';

const ResumeAnalyzer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Reset results when a new file is uploaded
      setResults(null);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setResults(null);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleAnalyze = () => {
    setIsAnalyzing(true);
    
    // Simulate analysis with a timeout
    setTimeout(() => {
      // This would be replaced with actual API call to analyze the resume
      setResults({
        score: 72,
        findings: [
          {
            category: 'Format and Layout',
            score: 80,
            issues: [
              { 
                severity: 'warning',
                message: 'Resume length exceeds one page, which may be too long for entry-level positions',
                recommendation: 'Condense content to fit on a single page by prioritizing relevant experiences'
              }
            ]
          },
          {
            category: 'ATS Compatibility',
            score: 65,
            issues: [
              { 
                severity: 'error',
                message: 'Complex table layout detected which may not parse correctly in ATS systems',
                recommendation: 'Replace tables with simple text formatting and bullet points'
              },
              { 
                severity: 'error',
                message: 'Headers are in text boxes which are often not readable by ATS software',
                recommendation: 'Use standard text formatting for headers instead of text boxes or graphics'
              }
            ]
          },
          {
            category: 'Keywords and Skills',
            score: 70,
            issues: [
              { 
                severity: 'warning',
                message: 'Missing key industry terms relevant to the target role',
                recommendation: 'Add specific technical skills and industry keywords from the job description'
              }
            ]
          },
          {
            category: 'Content Quality',
            score: 85,
            issues: [
              { 
                severity: 'info',
                message: 'Experience descriptions focus more on responsibilities than achievements',
                recommendation: 'Quantify achievements with metrics and focus on results rather than duties'
              }
            ]
          },
          {
            category: 'Contact Information',
            score: 95,
            issues: []
          },
        ],
        keywordAnalysis: {
          missing: ['API development', 'agile methodology', 'cross-functional collaboration'],
          present: ['JavaScript', 'React', 'Node.js', 'Git', 'HTML/CSS']
        },
        improvement: {
          template: 'professional',
          suggestions: [
            'Use a cleaner, ATS-friendly format',
            'Add a skills section with a focus on technical competencies',
            'Include quantifiable achievements in experience descriptions',
            'Remove graphical elements and use standard text formatting'
          ]
        }
      });
      setIsAnalyzing(false);
    }, 2000);
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'text-red-600';
      case 'warning': return 'text-amber-600';
      case 'info': return 'text-blue-600';
      default: return 'text-slate-600';
    }
  };
  
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error': 
        return <FileWarning className="h-5 w-5 mr-2 text-red-500" />;
      case 'warning': 
        return <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />;
      case 'info': 
        return <Eye className="h-5 w-5 mr-2 text-blue-500" />;
      default: 
        return null;
    }
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Resume ATS Analyzer</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Check if your resume is optimized for Applicant Tracking Systems and get actionable recommendations
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {!results && (
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 mb-8">
              <div 
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
                onClick={() => document.getElementById('resume-upload')?.click()}
              >
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Upload className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-slate-900 mb-1">Upload Your Resume</h3>
                <p className="text-slate-500 mb-3">Drag and drop your resume file here or click to browse</p>
                <p className="text-sm text-slate-400">Supported formats: PDF, DOC, DOCX</p>
              </div>
              
              {file && (
                <div className="mt-4">
                  <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <FileCheck className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="font-medium">{file.name}</span>
                    </div>
                    <button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
                    >
                      {isAnalyzing ? (
                        <>
                          <Search className="h-4 w-4 mr-1.5 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-1.5" />
                          Analyze
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {results && (
            <div className="space-y-8">
              {/* Overall Score */}
              <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Resume ATS Score</h2>
                  <div className="inline-flex items-center justify-center bg-blue-50 text-blue-700 rounded-full w-20 h-20 text-2xl font-bold">
                    {results.score}%
                  </div>
                  <p className="text-slate-600 mt-2">
                    {results.score >= 80 
                      ? 'Your resume is well-optimized but could use minor improvements.' 
                      : results.score >= 60 
                        ? 'Your resume needs improvement to be fully ATS-compatible.' 
                        : 'Your resume has significant ATS issues that need to be addressed.'}
                  </p>
                </div>
                
                <div className="space-y-4">
                  {results.findings.map((finding: any, index: number) => (
                    <div key={index} className="border border-slate-200 rounded-lg overflow-hidden">
                      <div className="flex justify-between items-center bg-slate-50 px-4 py-2">
                        <h3 className="font-medium text-slate-900">{finding.category}</h3>
                        <div className="flex items-center">
                          <span className={`text-sm font-medium
                            ${finding.score >= 80 ? 'text-green-600' : 
                             finding.score >= 60 ? 'text-amber-600' : 'text-red-600'}`}
                          >
                            Score: {finding.score}%
                          </span>
                        </div>
                      </div>
                      
                      {finding.issues.length > 0 ? (
                        <div className="p-4 space-y-3">
                          {finding.issues.map((issue: any, issueIndex: number) => (
                            <div key={issueIndex} className="text-sm">
                              <div className="flex items-start mb-1">
                                {getSeverityIcon(issue.severity)}
                                <span className={`font-medium ${getSeverityColor(issue.severity)}`}>{issue.message}</span>
                              </div>
                              <div className="ml-7 text-slate-600">
                                <span className="font-medium">Recommendation:</span> {issue.recommendation}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-sm text-green-600">
                          No issues found in this category.
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Keyword Analysis */}
              <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Keyword Analysis</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-md font-medium text-slate-900 mb-2">Present Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {results.keywordAnalysis.present.map((keyword: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-md font-medium text-slate-900 mb-2">Missing Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {results.keywordAnalysis.missing.map((keyword: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Improvement Suggestions */}
              <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Improve Your Resume</h2>
                <div className="mb-4">
                  <h3 className="text-md font-medium text-slate-900 mb-2">Suggested Template</h3>
                  <p className="text-slate-600">
                    Based on your resume analysis, we recommend using our <span className="font-medium text-blue-700 capitalize">{results.improvement.template}</span> template 
                    for better ATS compatibility.
                  </p>
                </div>
                <div>
                  <h3 className="text-md font-medium text-slate-900 mb-2">Recommended Improvements</h3>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    {results.improvement.suggestions.map((suggestion: string, index: number) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6 flex justify-center">
                  <button
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Detailed Report
                  </button>
                </div>
              </div>
              
              {/* Footer Actions */}
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setFile(null);
                    setResults(null);
                  }}
                  className="inline-flex items-center px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg transition-colors"
                >
                  Upload Another Resume
                </button>
                <button
                  className="inline-flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
                >
                  Fix Issues with AI
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;