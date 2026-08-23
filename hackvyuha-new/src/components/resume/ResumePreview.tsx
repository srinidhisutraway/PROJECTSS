import React from 'react';

interface ResumePreviewProps {
  template: string;
  data: any;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ template, data }) => {
  // We'll show a simplified preview based on the selected template
  switch (template) {
    case 'professional':
      return <ProfessionalTemplate data={data} />;
    case 'modern':
      return <ModernTemplate data={data} />;
    case 'creative':
      return <CreativeTemplate data={data} />;
    case 'simple':
      return <SimpleTemplate data={data} />;
    default:
      return <ProfessionalTemplate data={data} />;
  }
};

const ProfessionalTemplate: React.FC<{ data: any }> = ({ data }) => {
  const { personalInfo, education, experience, skills } = data;
  
  return (
    <div className="p-6 max-h-[600px] overflow-y-auto text-slate-900">
      {/* Header */}
      <div className="border-b-2 border-blue-700 pb-4 mb-4">
        <h1 className="text-2xl font-bold text-blue-800">{personalInfo.name || 'Your Name'}</h1>
        <h2 className="text-lg text-slate-600">{personalInfo.title || 'Professional Title'}</h2>
        
        <div className="flex flex-wrap gap-x-4 text-sm mt-2">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </div>
      
      {/* Summary */}
      {personalInfo.summary && (
        <div className="mb-4">
          <h3 className="text-md font-semibold text-blue-800 mb-1">Professional Summary</h3>
          <p className="text-sm">{personalInfo.summary}</p>
        </div>
      )}
      
      {/* Experience */}
      {experience.length > 0 && experience[0].company && (
        <div className="mb-4">
          <h3 className="text-md font-semibold text-blue-800 mb-2">Professional Experience</h3>
          {experience.map((exp: any, index: number) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between">
                <h4 className="font-medium">{exp.position}</h4>
                <span className="text-sm text-slate-600">
                  {exp.startDate && new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                  {' - '}
                  {exp.current ? 'Present' : exp.endDate && new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                </span>
              </div>
              <div className="text-sm">
                <span className="font-medium">{exp.company}</span>
                {exp.location && <span> | {exp.location}</span>}
              </div>
              {exp.description && <p className="text-sm mt-1">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}
      
      {/* Education */}
      {education.length > 0 && education[0].institution && (
        <div className="mb-4">
          <h3 className="text-md font-semibold text-blue-800 mb-2">Education</h3>
          {education.map((edu: any, index: number) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between">
                <h4 className="font-medium">{edu.degree} {edu.field && `in ${edu.field}`}</h4>
                <span className="text-sm text-slate-600">
                  {edu.startDate && new Date(edu.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                  {' - '}
                  {edu.endDate && new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                </span>
              </div>
              <div className="text-sm">
                <span className="font-medium">{edu.institution}</span>
                {edu.gpa && <span> | GPA: {edu.gpa}</span>}
              </div>
              {edu.highlights && <p className="text-sm mt-1">{edu.highlights}</p>}
            </div>
          ))}
        </div>
      )}
      
      {/* Skills */}
      {skills.length > 0 && skills[0].name && (
        <div>
          <h3 className="text-md font-semibold text-blue-800 mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill: any, index: number) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                {skill.name} {skill.level && `(${skill.level})`}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ModernTemplate: React.FC<{ data: any }> = ({ data }) => {
  // For brevity, we'll just use the professional template with different styling
  const { personalInfo, education, experience, skills } = data;
  
  return (
    <div className="p-6 max-h-[600px] overflow-y-auto text-slate-900">
      {/* Header */}
      <div className="bg-teal-600 text-white p-4 rounded-lg mb-4">
        <h1 className="text-2xl font-bold">{personalInfo.name || 'Your Name'}</h1>
        <h2 className="text-lg opacity-90">{personalInfo.title || 'Professional Title'}</h2>
        
        <div className="flex flex-wrap gap-x-4 text-sm mt-2 opacity-90">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </div>
      
      {/* Two-column layout for modern style */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          {/* Skills */}
          {skills.length > 0 && skills[0].name && (
            <div className="mb-4">
              <h3 className="text-md font-semibold text-teal-700 mb-2 border-b border-teal-200 pb-1">Skills</h3>
              <div className="space-y-1">
                {skills.map((skill: any, index: number) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium">{skill.name}</span>
                    {skill.level && (
                      <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-teal-600 h-1.5 rounded-full"
                          style={{ 
                            width: skill.level === 'Beginner' ? '25%' : 
                                  skill.level === 'Intermediate' ? '50%' : 
                                  skill.level === 'Advanced' ? '75%' : '100%' 
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Education */}
          {education.length > 0 && education[0].institution && (
            <div className="mb-4">
              <h3 className="text-md font-semibold text-teal-700 mb-2 border-b border-teal-200 pb-1">Education</h3>
              {education.map((edu: any, index: number) => (
                <div key={index} className="mb-3 text-sm">
                  <div className="font-medium">{edu.degree}</div>
                  <div>{edu.field}</div>
                  <div className="opacity-75">{edu.institution}</div>
                  <div className="text-xs opacity-75">
                    {edu.startDate && new Date(edu.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                    {' - '}
                    {edu.endDate && new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="col-span-2">
          {/* Summary */}
          {personalInfo.summary && (
            <div className="mb-4">
              <h3 className="text-md font-semibold text-teal-700 mb-1 border-b border-teal-200 pb-1">About Me</h3>
              <p className="text-sm">{personalInfo.summary}</p>
            </div>
          )}
          
          {/* Experience */}
          {experience.length > 0 && experience[0].company && (
            <div className="mb-4">
              <h3 className="text-md font-semibold text-teal-700 mb-2 border-b border-teal-200 pb-1">Experience</h3>
              {experience.map((exp: any, index: number) => (
                <div key={index} className="mb-3 text-sm">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{exp.position}</h4>
                    <span className="text-xs opacity-75">
                      {exp.startDate && new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                      {' - '}
                      {exp.current ? 'Present' : exp.endDate && new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <div className="italic">{exp.company} {exp.location && `| ${exp.location}`}</div>
                  {exp.description && <p className="mt-1">{exp.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CreativeTemplate: React.FC<{ data: any }> = ({ data }) => {
  // For brevity in this example, we'll show a placeholder for creative template
  return (
    <div className="p-6 max-h-[600px] overflow-y-auto text-slate-900 bg-gradient-to-br from-purple-50 to-white">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-purple-800">{data.personalInfo.name || 'Your Name'}</h1>
        <div className="h-0.5 w-16 bg-purple-600 mx-auto my-2"></div>
        <h2 className="text-lg text-purple-600">{data.personalInfo.title || 'Professional Title'}</h2>
        
        <div className="flex flex-wrap justify-center gap-x-4 text-sm mt-2 text-slate-600">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
        </div>
      </div>
      
      <div className="text-center text-slate-600 italic mb-6">
        {data.personalInfo.summary || 'Your professional summary goes here...'}
      </div>
      
      <div className="text-center">
        <p className="text-sm">Full resume preview not available in this view. Please download to see the complete resume.</p>
      </div>
    </div>
  );
};

const SimpleTemplate: React.FC<{ data: any }> = ({ data }) => {
  // For brevity in this example, we'll show a placeholder for simple template
  const { personalInfo, education, experience, skills } = data;
  
  return (
    <div className="p-6 max-h-[600px] overflow-y-auto text-slate-900">
      {/* Header */}
      <div className="border-b border-slate-300 pb-4 mb-4 text-center">
        <h1 className="text-2xl font-bold text-slate-800">{personalInfo.name || 'Your Name'}</h1>
        <h2 className="text-md text-slate-600">{personalInfo.title || 'Professional Title'}</h2>
        
        <div className="flex flex-wrap justify-center gap-x-4 text-sm mt-2 text-slate-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </div>
      
      {/* Sections with minimal styling */}
      {personalInfo.summary && (
        <div className="mb-4">
          <h3 className="text-md font-semibold text-slate-800 uppercase mb-1">Summary</h3>
          <p className="text-sm">{personalInfo.summary}</p>
        </div>
      )}
      
      {experience.length > 0 && experience[0].company && (
        <div className="mb-4">
          <h3 className="text-md font-semibold text-slate-800 uppercase mb-2">Experience</h3>
          {experience.map((exp: any, index: number) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between">
                <h4 className="font-medium">{exp.position}</h4>
                <span className="text-sm text-slate-600">
                  {exp.startDate && new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                  {' - '}
                  {exp.current ? 'Present' : exp.endDate && new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                </span>
              </div>
              <div className="text-sm">
                <span className="font-medium">{exp.company}</span>
                {exp.location && <span> | {exp.location}</span>}
              </div>
              {exp.description && <p className="text-sm mt-1">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}
      
      {education.length > 0 && education[0].institution && (
        <div className="mb-4">
          <h3 className="text-md font-semibold text-slate-800 uppercase mb-2">Education</h3>
          {education.map((edu: any, index: number) => (
            <div key={index} className="mb-2">
              <div className="flex justify-between">
                <h4 className="font-medium">{edu.degree} {edu.field && `in ${edu.field}`}</h4>
                <span className="text-sm text-slate-600">
                  {edu.startDate && new Date(edu.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                  {' - '}
                  {edu.endDate && new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                </span>
              </div>
              <div className="text-sm">
                <span className="font-medium">{edu.institution}</span>
                {edu.gpa && <span> | GPA: {edu.gpa}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {skills.length > 0 && skills[0].name && (
        <div>
          <h3 className="text-md font-semibold text-slate-800 uppercase mb-2">Skills</h3>
          <p className="text-sm">
            {skills.map((skill: any, index: number) => (
              <span key={index}>{skill.name}{index < skills.length - 1 ? ', ' : ''}</span>
            ))}
          </p>
        </div>
      )}
    </div>
  );
};

export default ResumePreview;