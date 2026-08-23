import React from 'react';
import { Download, Calendar, BookOpen, FileText, Bookmark, BarChart3 } from 'lucide-react';

const Dashboard: React.FC = () => {
  // Sample data for the dashboard
  const savedResumes = [
    { id: 1, name: 'Software Developer Resume', date: '2023-10-15', score: 92 },
    { id: 2, name: 'UX Designer Resume', date: '2023-09-22', score: 87 },
  ];
  
  const upcomingDeadlines = [
    { id: 1, title: 'Google Internship Application', date: '2023-12-15' },
    { id: 2, title: 'AWS Certification Exam', date: '2023-11-30' },
  ];
  
  const recommendedCourses = [
    { 
      id: 1, 
      title: 'Web Development Bootcamp', 
      provider: 'Udemy',
      duration: '12 weeks',
      url: '#'
    },
    { 
      id: 2, 
      title: 'UX Research & Design', 
      provider: 'Coursera',
      duration: '6 weeks',
      url: '#'
    },
    { 
      id: 3, 
      title: 'Data Science Fundamentals', 
      provider: 'edX',
      duration: '8 weeks',
      url: '#'
    },
  ];
  
  const careerPathProgress = [
    { name: 'Technical Skills', progress: 75 },
    { name: 'Industry Knowledge', progress: 60 },
    { name: 'Professional Network', progress: 45 },
    { name: 'Portfolio Development', progress: 80 },
  ];
  
  const jobListings = [
    {
      id: 1,
      title: 'Frontend Developer',
      company: 'Tech Solutions Inc.',
      location: 'Remote',
      matchScore: 92,
      postedDate: '2 days ago',
      saved: true
    },
    {
      id: 2,
      title: 'UX/UI Designer',
      company: 'Creative Digital Agency',
      location: 'New York, NY',
      matchScore: 87,
      postedDate: '5 days ago',
      saved: false
    },
    {
      id: 3,
      title: 'Junior Data Analyst',
      company: 'Data Insights Group',
      location: 'Chicago, IL',
      matchScore: 78,
      postedDate: '1 week ago',
      saved: true
    },
  ];

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Your Dashboard</h1>
              <p className="text-slate-600 mt-1">Track your career progress and recommendations</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                Career Progress Report
              </button>
            </div>
          </div>
          
          {/* Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              {/* Career Path Progress */}
              <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Career Path Progress</h2>
                <div className="space-y-4">
                  {careerPathProgress.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700">{item.name}</span>
                        <span className="text-sm font-medium text-slate-700">{item.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <h3 className="text-md font-medium text-slate-900 mb-2">Next Steps</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="bg-blue-100 text-blue-700 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">
                        1
                      </div>
                      <span className="text-slate-700">Complete AWS Cloud Practitioner certification</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-blue-100 text-blue-700 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">
                        2
                      </div>
                      <span className="text-slate-700">Add two more projects to your portfolio</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-blue-100 text-blue-700 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">
                        3
                      </div>
                      <span className="text-slate-700">Connect with 5 professionals in your target industry</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Job Listings */}
              <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-slate-900">Recommended Jobs</h2>
                  <a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</a>
                </div>
                <div className="space-y-4">
                  {jobListings.map((job) => (
                    <div key={job.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-slate-900">{job.title}</h3>
                          <p className="text-slate-600 text-sm">{job.company} • {job.location}</p>
                          <p className="text-slate-500 text-xs mt-1">Posted {job.postedDate}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                            {job.matchScore}% Match
                          </span>
                          <button className="mt-2 text-amber-500 hover:text-amber-600">
                            <Bookmark className="h-5 w-5" fill={job.saved ? "currentColor" : "none"} />
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between">
                        <span className="text-xs text-slate-500">Skills: JavaScript, React, CSS</span>
                        <a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium">Apply</a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-8">
              {/* Saved Resumes */}
              <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Your Resumes</h2>
                <div className="space-y-3">
                  {savedResumes.map((resume) => (
                    <div key={resume.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <div>
                        <div className="font-medium text-slate-900">{resume.name}</div>
                        <div className="text-xs text-slate-500">
                          Created: {new Date(resume.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-3 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                          Score: {resume.score}
                        </span>
                        <button className="text-blue-600 hover:text-blue-800">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <a href="/resume-builder" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    + Create New Resume
                  </a>
                </div>
              </div>
              
              {/* Upcoming Deadlines */}
              <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Upcoming Deadlines</h2>
                <div className="space-y-3">
                  {upcomingDeadlines.map((deadline) => (
                    <div key={deadline.id} className="flex items-start p-3 bg-amber-50 border border-amber-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-slate-900">{deadline.title}</div>
                        <div className="text-xs text-slate-500">
                          Due: {new Date(deadline.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    + Add Deadline
                  </a>
                </div>
              </div>
              
              {/* Recommended Courses */}
              <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Recommended Learning</h2>
                <div className="space-y-3">
                  {recommendedCourses.map((course) => (
                    <div key={course.id} className="flex items-start p-3 bg-slate-50 rounded-lg">
                      <BookOpen className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-slate-900">{course.title}</div>
                        <div className="text-xs text-slate-500">
                          {course.provider} • {course.duration}
                        </div>
                        <a 
                          href={course.url} 
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium mt-1 inline-block"
                        >
                          View Course
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;