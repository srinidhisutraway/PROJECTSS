import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Search, BarChart3, GraduationCap } from 'lucide-react';
import FeatureCard from '../components/FeatureCard';
import TestimonialCard from '../components/TestimonialCard';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <FileText className="h-8 w-8 text-blue-600" />,
      title: 'Resume Builder',
      description: 'Create ATS-optimized resumes in minutes with our AI-powered builder. Stand out to recruiters with professionally designed templates.',
      linkTo: '/resume-builder'
    },
    {
      icon: <Search className="h-8 w-8 text-teal-600" />,
      title: 'Resume Analyzer',
      description: 'Upload your existing resume and get instant feedback on ATS compatibility, with actionable suggestions for improvement.',
      linkTo: '/resume-analyzer'
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-amber-600" />,
      title: 'Career Test',
      description: 'Discover your ideal career path with our personalized assessment. Get matched with roles that align with your strengths and interests.',
      linkTo: '/career-test'
    },
    {
      icon: <GraduationCap className="h-8 w-8 text-indigo-600" />,
      title: 'Career Resources',
      description: 'Access tailored recommendations for courses, certifications, and job opportunities in your recommended career path.',
      linkTo: '/dashboard'
    }
  ];

  const testimonials = [
    {
      name: 'Alex Johnson',
      role: 'Computer Science Graduate',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600',
      quote: 'CareerCraft AI helped me land interviews at 3 tech companies within a week of optimizing my resume. The career test was incredibly accurate!'
    },
    {
      name: 'Sarah Miller',
      role: 'Marketing Intern',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600',
      quote: 'The resume analyzer pointed out issues I never would have caught. After implementing the suggestions, I received callbacks from 80% of my applications.'
    },
    {
      name: 'David Chen',
      role: 'Business Administration Student',
      image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600',
      quote: 'The career test recommended roles I hadn\'t even considered but ended up being perfect for my skill set. The resource recommendations were spot on.'
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6 animate-fade-in">
              Launch Your Career With Confidence
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 leading-relaxed mb-8">
              AI-powered career guidance, resume optimization, and personalized recommendations for students and freshers.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/resume-builder"
                className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300"
              >
                Build Your Resume
              </Link>
              <Link 
                to="/career-test"
                className="bg-white hover:bg-blue-50 text-blue-800 font-medium py-3 px-6 rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300"
              >
                Take Career Test
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">How CareerCraft AI Helps You</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our AI-powered platform provides all the tools you need to kickstart your career journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                linkTo={feature.linkTo}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-50 py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Get started in just a few simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 text-blue-700 font-bold rounded-full w-12 h-12 flex items-center justify-center mb-6">1</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Take the Career Test</h3>
              <p className="text-slate-600">
                Answer questions about your interests, strengths, and goals to discover your ideal career path.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 text-blue-700 font-bold rounded-full w-12 h-12 flex items-center justify-center mb-6">2</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Build Your Resume</h3>
              <p className="text-slate-600">
                Create or upload a resume and our AI will optimize it for applicant tracking systems.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 text-blue-700 font-bold rounded-full w-12 h-12 flex items-center justify-center mb-6">3</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Apply with Confidence</h3>
              <p className="text-slate-600">
                Use your optimized resume and personalized career insights to land your dream job.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              See how CareerCraft AI has helped students and freshers launch their careers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                name={testimonial.name}
                role={testimonial.role}
                image={testimonial.image}
                quote={testimonial.quote}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-teal-700 to-teal-500 text-white py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Launch Your Career?</h2>
          <p className="text-xl text-teal-100 mb-8 max-w-3xl mx-auto">
            Join thousands of students and freshers who have found their ideal career path with CareerCraft AI.
          </p>
          <Link 
            to="/career-test"
            className="bg-white hover:bg-teal-50 text-teal-700 font-medium py-3 px-8 rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300 inline-block"
          >
            Get Started for Free
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;