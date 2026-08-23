import React from 'react';
import { CheckCircle } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  color: string;
}

interface ResumeTemplateSelectorProps {
  templates: Template[];
  activeTemplate: Template;
  onSelectTemplate: (template: Template) => void;
}

const ResumeTemplateSelector: React.FC<ResumeTemplateSelectorProps> = ({ 
  templates, 
  activeTemplate, 
  onSelectTemplate 
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {templates.map((template) => {
        const isActive = template.id === activeTemplate.id;
        const colorMap: Record<string, string> = {
          blue: 'bg-blue-600',
          teal: 'bg-teal-600',
          purple: 'bg-purple-600',
          gray: 'bg-slate-600',
        };
        
        return (
          <div 
            key={template.id}
            onClick={() => onSelectTemplate(template)}
            className={`
              cursor-pointer rounded-lg transition-all duration-200 border-2 p-4 text-center
              ${isActive 
                ? 'border-blue-600 bg-blue-50' 
                : 'border-slate-200 hover:border-slate-300'}
            `}
          >
            <div className="mb-3 relative">
              <div className={`h-32 ${colorMap[template.color]} rounded-md opacity-20`}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <div className={`w-12 h-12 ${colorMap[template.color]} rounded-full`}></div>
                </div>
              </div>
              {isActive && (
                <div className="absolute top-2 right-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 bg-white rounded-full" />
                </div>
              )}
            </div>
            <span className="font-medium text-slate-900">{template.name}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ResumeTemplateSelector;