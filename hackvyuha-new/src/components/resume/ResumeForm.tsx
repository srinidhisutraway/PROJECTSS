import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface ResumeFormProps {
  resumeData: any;
  onChange: (section: string, data: any) => void;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ resumeData, onChange }) => {
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange('personalInfo', {
      ...resumeData.personalInfo,
      [name]: value
    });
  };
  
  const handleArrayFieldChange = (section: string, index: number, field: string, value: any) => {
    const newArray = [...resumeData[section]];
    newArray[index] = {
      ...newArray[index],
      [field]: value
    };
    onChange(section, newArray);
  };
  
  const addArrayItem = (section: string, template: any) => {
    onChange(section, [...resumeData[section], template]);
  };
  
  const removeArrayItem = (section: string, index: number) => {
    const newArray = [...resumeData[section]];
    newArray.splice(index, 1);
    onChange(section, newArray);
  };

  return (
    <div className="space-y-8">
      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={resumeData.personalInfo.name}
              onChange={handlePersonalInfoChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., John Smith"
            />
          </div>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
              Professional Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={resumeData.personalInfo.title}
              onChange={handlePersonalInfoChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Software Engineer"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={resumeData.personalInfo.email}
              onChange={handlePersonalInfoChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., john.smith@example.com"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={resumeData.personalInfo.phone}
              onChange={handlePersonalInfoChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., (555) 123-4567"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={resumeData.personalInfo.location}
              onChange={handlePersonalInfoChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., New York, NY"
            />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="summary" className="block text-sm font-medium text-slate-700 mb-1">
            Professional Summary
          </label>
          <textarea
            id="summary"
            name="summary"
            value={resumeData.personalInfo.summary}
            onChange={handlePersonalInfoChange}
            rows={4}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write a compelling summary of your professional background, skills, and career objectives..."
          />
        </div>
      </div>
      
      {/* Education */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Education</h3>
          <button
            type="button"
            onClick={() => addArrayItem('education', { 
              institution: '', 
              degree: '', 
              field: '', 
              startDate: '', 
              endDate: '', 
              gpa: '',
              highlights: '' 
            })}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Education
          </button>
        </div>
        
        {resumeData.education.map((edu: any, index: number) => (
          <div key={index} className="p-4 border border-slate-200 rounded-lg mb-4">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-medium">Education #{index + 1}</h4>
              {resumeData.education.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('education', index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Institution
                </label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => handleArrayFieldChange('education', index, 'institution', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="University or School Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Degree
                </label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => handleArrayFieldChange('education', index, 'degree', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Bachelor of Science"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Field of Study
                </label>
                <input
                  type="text"
                  value={edu.field}
                  onChange={(e) => handleArrayFieldChange('education', index, 'field', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Computer Science"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Start Date
                </label>
                <input
                  type="month"
                  value={edu.startDate}
                  onChange={(e) => handleArrayFieldChange('education', index, 'startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  End Date
                </label>
                <input
                  type="month"
                  value={edu.endDate}
                  onChange={(e) => handleArrayFieldChange('education', index, 'endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="mt-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                GPA (Optional)
              </label>
              <input
                type="text"
                value={edu.gpa}
                onChange={(e) => handleArrayFieldChange('education', index, 'gpa', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 3.8/4.0"
              />
            </div>
            
            <div className="mt-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Achievements/Highlights
              </label>
              <textarea
                value={edu.highlights}
                onChange={(e) => handleArrayFieldChange('education', index, 'highlights', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Dean's List, Relevant Coursework, Academic Achievements"
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Skills */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Skills</h3>
          <button
            type="button"
            onClick={() => addArrayItem('skills', { name: '', level: 'Intermediate' })}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Skill
          </button>
        </div>
        
        <div className="space-y-3">
          {resumeData.skills.map((skill: any, index: number) => (
            <div key={index} className="flex items-center gap-3">
              <input
                type="text"
                value={skill.name}
                onChange={(e) => handleArrayFieldChange('skills', index, 'name', e.target.value)}
                className="flex-grow px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., JavaScript"
              />
              <select
                value={skill.level}
                onChange={(e) => handleArrayFieldChange('skills', index, 'level', e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
              {resumeData.skills.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('skills', index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Experience */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Experience</h3>
          <button
            type="button"
            onClick={() => addArrayItem('experience', { 
              company: '', 
              position: '', 
              location: '', 
              startDate: '', 
              endDate: '', 
              current: false, 
              description: '' 
            })}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Experience
          </button>
        </div>
        
        {resumeData.experience.map((exp: any, index: number) => (
          <div key={index} className="p-4 border border-slate-200 rounded-lg mb-4">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-medium">Experience #{index + 1}</h4>
              {resumeData.experience.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('experience', index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Company/Organization
                </label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => handleArrayFieldChange('experience', index, 'company', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Company Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Position
                </label>
                <input
                  type="text"
                  value={exp.position}
                  onChange={(e) => handleArrayFieldChange('experience', index, 'position', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Software Engineer"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={exp.location}
                  onChange={(e) => handleArrayFieldChange('experience', index, 'location', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., New York, NY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Start Date
                </label>
                <input
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => handleArrayFieldChange('experience', index, 'startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  End Date
                </label>
                <div className="flex items-center mb-1">
                  <input
                    type="checkbox"
                    id={`current-${index}`}
                    checked={exp.current}
                    onChange={(e) => handleArrayFieldChange('experience', index, 'current', e.target.checked)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                  />
                  <label htmlFor={`current-${index}`} className="text-sm text-slate-700">
                    Current Position
                  </label>
                </div>
                {!exp.current && (
                  <input
                    type="month"
                    value={exp.endDate}
                    onChange={(e) => handleArrayFieldChange('experience', index, 'endDate', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                value={exp.description}
                onChange={(e) => handleArrayFieldChange('experience', index, 'description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your responsibilities, achievements, and projects..."
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumeForm;