import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Briefcase className="h-6 w-6" />
              <span className="text-lg font-bold">CareerCraft AI</span>
            </Link>
            <p className="text-slate-300 mb-4">
              Empowering students and fresh graduates to kickstart their careers with AI-powered tools and insights.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-300 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-300 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/resume-builder" className="text-slate-300 hover:text-white transition-colors">Resume Builder</Link>
              </li>
              <li>
                <Link to="/resume-analyzer" className="text-slate-300 hover:text-white transition-colors">Resume Analyzer</Link>
              </li>
              <li>
                <Link to="/career-test" className="text-slate-300 hover:text-white transition-colors">Career Assistance Test</Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-300 hover:text-white transition-colors">Dashboard</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-slate-300 hover:text-white transition-colors">Career Blog</a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-white transition-colors">Interview Tips</a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-white transition-colors">Job Search Guide</a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-white transition-colors">Support</a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-white transition-colors">Privacy Policy</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
          <p>&copy; {new Date().getFullYear()} CareerCraft AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;