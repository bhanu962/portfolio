import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Copy, Check, MapPin } from 'lucide-react';
import { Github, Linkedin } from '../Icons/SocialIcons';
import SvgButton from '../UI/SvgButton';
import confetti from 'canvas-confetti';
import { personalInfo } from '../../data/personalInfo';

export default function Contact({ playHover, playClick, playSuccess }) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    if (playClick) playClick();
    navigator.clipboard.writeText(personalInfo.socials.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    if (playClick) playClick();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      if (playSuccess) playSuccess();

      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#B94B3E', '#C54E41', '#E06051', '#0F172A'],
        });
      } catch {
        // Ignore confetti error if any
      }

      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 6000);
    }, 800);
  };

  return (
    <section id="contact" className="relative py-28 px-6 md:px-12 max-w-7xl mx-auto z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
        {/* Left Column */}
        <motion.div
          className="lg:col-span-5 flex flex-col"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#B94B3E]" />
            <span className="text-xs font-bold tracking-widest text-[#B94B3E] uppercase font-mono">
              GET IN TOUCH
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight text-slate-950 mb-6 leading-tight">
            Let's create something extraordinary
          </h2>

          <p className="text-slate-600 text-base leading-relaxed mb-8 font-normal">
            Have an exciting project, team role, or opportunity? Let's connect and discuss how we can collaborate.
          </p>

          {/* Availability Status */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm mb-4 flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E06051] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#B94B3E]" />
            </span>
            <span className="text-xs font-medium text-slate-700 font-mono">
              {personalInfo.availability}
            </span>
          </div>

          {/* Email Quick Copy */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2 rounded-xl bg-red-50 text-[#B94B3E] shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <span className="font-mono text-xs sm:text-sm text-slate-800 truncate font-semibold">
                {personalInfo.socials.email}
              </span>
            </div>

            <motion.button
              onClick={handleCopyEmail}
              onMouseEnter={playHover}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all shrink-0 cursor-pointer"
              title="Copy Email"
              data-cursor="hover"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4 text-slate-600" />
              )}
            </motion.button>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <motion.a
              href={personalInfo.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={playHover}
              onClick={playClick}
              whileHover={{ scale: 1.15, rotate: 6, y: -2 }}
              whileTap={{ scale: 0.92 }}
              className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-[#B94B3E] hover:border-[#B94B3E]/40 shadow-sm transition-colors"
              data-cursor="hover"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </motion.a>

            <motion.a
              href={personalInfo.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={playHover}
              onClick={playClick}
              whileHover={{ scale: 1.15, rotate: -6, y: -2 }}
              whileTap={{ scale: 0.92 }}
              className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-[#B94B3E] hover:border-[#B94B3E]/40 shadow-sm transition-colors"
              data-cursor="hover"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </motion.a>

            <div className="flex items-center gap-1.5 pl-2 text-xs font-mono text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-[#B94B3E]" />
              <span>{personalInfo.location}</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Contact Form */}
        <motion.div
          className="lg:col-span-7"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="cred-panel p-7 sm:p-9 rounded-3xl">
            <h3 className="text-2xl font-bold font-display text-slate-900 mb-1">
              Send a message
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm mb-6 font-normal">
              Directly transmit your inquiry or message.
            </p>

            {submitted ? (
              <motion.div
                className="py-10 flex flex-col items-center justify-center text-center gap-3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold font-display text-slate-900">
                  Message Sent!
                </h4>
                <p className="text-slate-600 text-sm max-w-sm">
                  Thank you for reaching out, {formData.name || 'friend'}! I will reply as soon as possible.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-600 mb-1 font-medium">
                      YOUR NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Alex Mercer"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#B94B3E] focus:ring-2 focus:ring-red-100 transition-all text-sm font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-600 mb-1 font-medium">
                      EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alex@example.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#B94B3E] focus:ring-2 focus:ring-red-100 transition-all text-sm font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-600 mb-1 font-medium">
                    SUBJECT
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Project Inquiry / Opportunity"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#B94B3E] focus:ring-2 focus:ring-red-100 transition-all text-sm font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-600 mb-1 font-medium">
                    MESSAGE *
                  </label>
                  <textarea
                    required
                    rows="4"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me about your goals, timeline, or idea..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#B94B3E] focus:ring-2 focus:ring-red-100 transition-all text-sm font-sans resize-none"
                  />
                </div>

                {/* SvgButton for Contact Form */}
                <SvgButton
                  type="submit"
                  disabled={isSubmitting}
                  onMouseEnter={playHover}
                  variant="primary"
                  icon={isSubmitting ? null : Send}
                  className="mt-2 w-full !py-3.5"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    'Send message'
                  )}
                </SvgButton>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
