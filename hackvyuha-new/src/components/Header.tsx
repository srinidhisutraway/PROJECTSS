import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Briefcase } from 'lucide-react';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  
  const isActive = (path: string) => location.pathname === path;
  
  const headerClass = `fixed top-0 w-full transition-all duration-300 z-50 ${
    isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
  }`;
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Resume Builder', path: '/resume-builder' },
    { name: 'Resume Analyzer', path: '/resume-analyzer' },
    { name: 'Career Test', path: '/career-test' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  return (
    <header className={headerClass}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link 
            to="/"
            className="flex items-center space-x-2 text-blue-900 hover:text-blue-700 transition-colors"
            onClick={closeMenu}
          >
            <Briefcase className="h-8 w-8" />
            <span className="text-xl font-bold">CareerCraft AI</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors hover:text-blue-700 ${
                  isActive(link.path) 
                    ? 'text-blue-700 font-medium' 
                    : 'text-slate-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-slate-700 hover:text-blue-700 transition-colors"
            onClick={toggleMenu}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block transition-colors hover:text-blue-700 ${
                  isActive(link.path) 
                    ? 'text-blue-700 font-medium' 
                    : 'text-slate-700'
                }`}
                onClick={closeMenu}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;