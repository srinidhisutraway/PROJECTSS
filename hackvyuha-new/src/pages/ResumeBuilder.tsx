import React, { useState } from 'react';
import { Save, Download, RefreshCw } from 'lucide-react';
import ResumeTemplateSelector from '../components/resume/ResumeTemplateSelector';
import ResumeForm from '../components/resume/ResumeForm';
import ResumePreview from '../components/resume/ResumePreview';

const templates = [
  { id: 'professional', name: 'Professional', color: 'blue' },
  { id: 'modern', name: 'Modern', color: 'teal' },
  { id: 'creative', name: 'Creative', color: 'purple' },
  { id: 'simple', name: 'Simple', color: 'gray' },
];

const ResumeBuilder: React.FC = () => {
  const [activeTemplate, setActiveTemplate] = useState(templates[0]);
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      title: '',
      summary: '',
    },
    education: [{ 
      institution: '', 
      degree: '', 
      field: '', 
      startDate: '', 
      endDate: '', 
      gpa: '',
      highlights: '' 
    }],
    experience: [{ 
      company: '', 
      position: '', 
      location: '', 
      startDate: '', 
      endDate: '', 
      current: false, 
      description: '' 
    }],
    skills: [{ name: '', level: 'Intermediate' }],
    projects: [{ 
      name: '', 
      description: '', 
      technologies: '', 
      url: '' 
    }],
    certifications: [{ 
      name: '', 
      issuer: '', 
      date: '' 
    }],
  });
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleTemplateChange = (template: any) => {
    setActiveTemplate(template);
  };
  
  const handleFormChange = (section: string, data: any) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data
    }));
  };
  
  const generateAIContent = () => {
    // Simulate AI generation with a timeout
    setIsGenerating(true);
    setTimeout(() => {
      // This would be replaced with actual AI generation API call
      setResumeData({
        personalInfo: {
          name: 'Alex Morgan',
          email: 'alex.morgan@example.com',
          phone: '(555) 123-4567',
          location: 'San Francisco, CA',
          title: 'Full Stack Developer',
          summary: 'Recent computer science graduate with strong foundation in web development and practical experience through internships and academic projects. Passionate about creating efficient, user-friendly applications.',
        },
        education: [{
          institution: 'University of California, Berkeley',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          startDate: '2019-09',
          endDate: '2023-05',
          gpa: '3.8',
          highlights: 'Dean\'s List, Member of Computer Science Honor Society, Relevant coursework: Data Structures, Algorithms, Web Development, Database Systems'
        }],
        experience: [{
          company: 'TechStart Solutions',
          position: 'Web Development Intern',
          location: 'San Francisco, CA',
          startDate: '2022-06',
          endDate: '2022-08',
          current: false,
          description: 'Developed responsive web applications using React and Node.js. Collaborated with senior developers to implement features and fix bugs. Participated in code reviews and daily stand-up meetings.'
        }],
        skills: [
          { name: 'JavaScript', level: 'Advanced' },
          { name: 'React', level: 'Intermediate' },
          { name: 'Node.js', level: 'Intermediate' },
          { name: 'Python', level: 'Intermediate' },
          { name: 'Git', level: 'Intermediate' },
          { name: 'HTML/CSS', level: 'Advanced' },
        ],
        projects: [{
          name: 'E-commerce Platform',
          description: 'Built a full-stack e-commerce application with product catalog, shopping cart, and secure checkout using Stripe.',
          technologies: 'React, Node.js, Express, MongoDB, Stripe API',
          url: 'github.com/alexmorgan/ecommerce-platform'
        }],
        certifications: [{
          name: 'AWS Certified Developer - Associate',
          issuer: 'Amazon Web Services',
          date: '2023-02'
        }],
      });
      setIsGenerating(false);
    }, 1500);
  };
  
  const handleSave = () => {
    // Logic to save resume to user account
    alert('Resume saved successfully!');
  };
  
  const handleDownload = () => {
    // Logic to download resume as PDF
    alert('Resume downloaded as PDF!');
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Resume Builder</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Create an ATS-optimized resume that stands out to recruiters and hiring managers
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Choose a Template</h2>
          <ResumeTemplateSelector 
            templates={templates}
            activeTemplate={activeTemplate}
            onSelectTemplate={handleTemplateChange}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Resume Information</h2>
              <button
                onClick={generateAIContent}
                className="inline-flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Generate with AI
                  </>
                )}
              </button>
            </div>
            
            <ResumeForm 
              resumeData={resumeData}
              onChange={handleFormChange}
            />
          </div>
          
          <div>
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-900">Preview</h2>
                <div className="flex space-x-3">
                  <button
                    onClick={handleSave}
                    className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </button>
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </button>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                <ResumePreview
                  template={activeTemplate.id}
                  data={resumeData}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;