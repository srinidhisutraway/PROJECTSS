import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Send } from 'lucide-react';

const Contact: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // This is a demo contact form for the final-year-project landing page.
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Message sent — we'll get back to you soon!");
      (e.target as HTMLFormElement).reset();
    }, 900);
  };

  return (
    <section id="contact" className="mx-auto max-w-3xl px-6 py-24">
      <div className="glass-card p-8 md:p-12">
        <div className="text-center">
          <h2 className="font-display text-3xl font-semibold text-ink dark:text-canvas">Get in touch</h2>
          <p className="mt-3 text-ink/60 dark:text-canvas/60">
            Questions, feedback, or partnership ideas — we'd love to hear from you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <input required placeholder="Your name" className="input-field" />
          <input required type="email" placeholder="Your email" className="input-field" />
          <textarea required placeholder="Your message" rows={4} className="input-field md:col-span-2" />
          <button type="submit" disabled={submitting} className="btn-primary md:col-span-2">
            {submitting ? 'Sending…' : 'Send message'} <Send size={16} />
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
