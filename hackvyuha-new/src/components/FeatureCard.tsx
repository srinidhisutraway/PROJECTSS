import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkTo: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, linkTo }) => {
  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-hover p-6 border border-slate-100 flex flex-col h-full transform hover:-translate-y-1 transition-all duration-300 ease-in-out">
      <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{title}</h3>
      <p className="text-slate-600 mb-5 flex-grow group-hover:text-slate-700 transition-colors">{description}</p>
      <Link 
        to={linkTo}
        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mt-auto group-hover:translate-x-1 transition-transform duration-300"
      >
        Get Started <ArrowRight className="ml-1 h-4 w-4 group-hover:ml-2 transition-all duration-300" />
      </Link>
    </div>
  );
};

export default FeatureCard;