import React from 'react';

interface TestimonialCardProps {
  name: string;
  role: string;
  image: string;
  quote: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ name, role, image, quote }) => {
  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-hover p-6 border border-slate-100 transform hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center mb-4">
        <div className="relative">
          <img 
            src={image} 
            alt={name} 
            className="w-12 h-12 rounded-full object-cover mr-4 group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 rounded-full border-2 border-blue-500 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
        </div>
        <div>
          <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{name}</h4>
          <p className="text-slate-500 text-sm">{role}</p>
        </div>
      </div>
      <p className="text-slate-700 italic group-hover:text-slate-900 transition-colors">"{quote}"</p>
    </div>
  );
};

export default TestimonialCard;