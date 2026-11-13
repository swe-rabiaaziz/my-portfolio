'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { 
  Mail, 
  Phone, 
  Calendar,
  MapPin, 
  Send, 
  Github, 
  Linkedin,
  Instagram, 
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { RevealContainer, RevealItem } from '@/components/ui/scroll_reveal';

export default function ContactSection() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);

  // ✅ YOUR EMAILJS CREDENTIALS
  const EMAILJS_SERVICE_ID = 'service_7v3rlf7';
  const EMAILJS_TEMPLATE_ID = 'template_dqknllo';
  const EMAILJS_PUBLIC_KEY = 'U1PPaPulCP0BM_S8i'; // 🔴 REPLACE THIS WITH YOUR PUBLIC KEY

  useEffect(() => {
    // Initialize EmailJS with your public key
    try {
      emailjs.init(EMAILJS_PUBLIC_KEY);
    } catch (e) {
      console.error('EmailJS initialization error:', e);
    }
  }, []);

  // Custom WhatsApp Icon Component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus('idle');

    try {
      const templateParams = {
        name: formState.name,
        email: formState.email,
        subject: formState.subject,
        message: formState.message,
        time: new Date().toLocaleString(),
      };

      console.log('📤 Sending email with params:', templateParams);

      // Send email using EmailJS
      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      console.log('✅ EmailJS Success:', result);
      setFormStatus('success');
      setFormState({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('❌ EmailJS Error:', error);
      
      // More detailed error logging
      if (error instanceof Error) {
        console.error('Error message:', error.message);
      }
      
      setFormStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setFormStatus('idle'), 5000);
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      value: 'swe.rabiaaziz@gmail.com',
      description: 'Drop me a line anytime',
      link: 'mailto:swe.rabiaaziz@gmail.com',
      color: 'from-slate-700 to-slate-900 dark:from-slate-300 dark:to-slate-100',
      accent: true
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+92 327 5676026',
      description: 'Anytime available for a call',
      link: 'tel:+923275676026',
      color: 'from-slate-600 to-slate-800 dark:from-slate-200 dark:to-slate-400',
      accent: true
    },
    {
icon: WhatsAppIcon,
      title: 'WhatsApp',
      value: '+92 327 5676026',
      description: 'Quick chat on WhatsApp',
      link: 'https://wa.me/923275676026',
      color: 'from-slate-800 to-slate-700 dark:from-slate-100 dark:to-slate-300',
      accent: true
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'Mingora, Swat, Pakistan',
      description: 'Available for remote work',
      link: null,
      color: 'from-slate-700 to-slate-600 dark:from-slate-300 dark:to-slate-200',
      accent: true
    },
  ];

  const socialLinks = [
    {
      icon: Github,
      name: 'GitHub',
      username: '@swe-rabiaaziz',
      link: 'https://github.com/swe-rabiaaziz',
      color: 'from-slate-800 to-slate-900 dark:from-slate-300 dark:to-slate-100'
    },
    {
      icon: Linkedin,
      name: 'LinkedIn',
      username: '@swe-rabiaaziz',
      link: 'https://www.linkedin.com/in/swe-rabiaaziz/',
      color: 'from-slate-700 to-slate-800 dark:from-slate-200 dark:to-slate-400'
    },
    {
      icon: WhatsAppIcon,
      name: 'WhatsApp',
      username: '+92 327 5676026',
      link: 'https://wa.me/923275676026',
      color: 'from-slate-800 to-slate-700 dark:from-slate-100 dark:to-slate-300'
    },
    {
      icon: Instagram,
      name: 'Instagram',
      username: '@swe.rabiaaziz',
      link: 'https://www.instagram.com/swe.rabiaaziz/',
      color: 'from-slate-600 to-slate-700 dark:from-slate-300 dark:to-slate-500'
    },
    {
      icon: Calendar,
      name: 'Book a Meeting',
      username: 'Schedule Meet',
      link: 'https://calendly.com/swe-rabiaaziz/30min',
      color: 'from-slate-700 to-slate-900 dark:from-slate-300 dark:to-slate-100',
      accent: true
    },
  ];

  return (
    <section
      id="contact"
      className="py-24 px-4 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <RevealContainer>
          {/* Header */}
          <RevealItem className="text-center mb-10 sm:mb-20">
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-display mb-4 sm:mb-6 text-center tracking-tight">
              Get In{' '}
              <span
                className="neu-header-badge rounded-2xl px-4 sm:px-5 py-1.5 inline-block group cursor-pointer translate-y-1 sm:translate-y-4"
                style={{
                  backgroundImage: "url('/messageContainerBG.jpeg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <span className="absolute inset-0 bg-gradient-to-br from-black/60 via-slate-900/50 to-black/60 rounded-2xl"></span>
                <span className="absolute inset-0 rounded-2xl border border-white/30 group-hover:border-white/50 transition-all duration-500 shadow-[inset_0_0_15px_rgba(255,255,255,0.15)]"></span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-white/60 rounded-full animate-pulse-glow"></span>
                <span className="absolute bottom-2 left-2 w-2 h-2 bg-white/60 rounded-full animate-pulse-glow-delayed"></span>
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/10 blur-3xl rounded-full animate-pulse-glow"></span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-2xl"></span>
                <span className="relative z-10 inline-block transform group-hover:scale-105 transition-transform duration-300">
                  <span 
                    className="relative text-white font-black select-none"
                    style={{
                      textShadow: '0 0 20px rgba(255,255,255,0.4), 0 0 40px rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.3)',
                      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))'
                    }}
                  >
                    Touch
                  </span>
                </span>
              </span>
            </h2>

            {/* Sword draw underline effect */}
            <div className="relative w-24 sm:w-32 h-[3px] bg-slate-800 dark:bg-slate-200 mx-auto overflow-hidden rounded-full mt-2 mb-4 sm:mb-6">
              <div className="absolute inset-0 bg-white w-full h-full -translate-x-full animate-sword-draw"></div>
            </div>

            <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed px-2">
              Have a project in mind or want to collaborate? I'd love to hear from you. Let's bring your vision to life!
            </p>
          </RevealItem>

          <div className="grid lg:grid-cols-5 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {/* Left Column */}
            <RevealItem className="lg:col-span-2 space-y-4 sm:space-y-6 pb-2 sm:pb-6">
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 sm:mb-4">
                  Contact Information
                </h3>
                {contactMethods.map((method) => {
                  const Icon = method.icon;
                  const isClickable = method.link !== null;

                  const CardContent = (
                    <div className="flex items-center gap-3 sm:gap-4 relative z-10">
                      <div className="w-12 h-12 neu-icon-btn rounded-2xl flex items-center justify-center flex-shrink-0 text-slate-800 dark:text-slate-200">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-0.5 sm:mb-1 flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                          {method.title}
                          {isClickable && <ExternalLink className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors" />}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium mb-0.5 truncate">
                          {method.value}
                        </p>
                        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">{method.description}</p>
                      </div>
                      {isClickable && <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 dark:text-slate-500 group-hover:translate-x-1 transition-transform flex-shrink-0" />}
                    </div>
                  );

                  return isClickable ? (
                    <a
                      key={method.title}
                      href={method.link}
                      className="neu-flat-interactive p-4 sm:p-5 rounded-3xl group cursor-pointer relative overflow-hidden block transition-all"
                    >
                      {CardContent}
                    </a>
                  ) : (
                    <div
                      key={method.title}
                      className="neu-flat p-4 sm:p-5 rounded-3xl group relative overflow-hidden"
                    >
                      {CardContent}
                    </div>
                  );
                })}
              </div>

              <div className="neu-flat p-5 sm:p-6 rounded-3xl group relative overflow-hidden">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-3 sm:mb-4 text-sm sm:text-base">Connect on Social</h3>
                <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    const isHovered = hoveredSocial === social.name;
                    return (
                      <div 
                        key={social.name}
                        className="relative"
                        onMouseEnter={() => setHoveredSocial(social.name)}
                        onMouseLeave={() => setHoveredSocial(null)}
                      >
                        <motion.a
                          href={social.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.name}
                          className={`group/social relative p-2.5 sm:p-3 rounded-full neu-button text-slate-800 dark:text-slate-200 flex items-center justify-center transition-all overflow-hidden ${isHovered ? 'w-auto px-4' : 'w-11 h-11'}`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          style={{ minWidth: '44px', minHeight: '44px' }}
                        >
                          <div className="flex items-center gap-2 relative z-10">
                            <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                            {isHovered && (
                              <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.25 }}
                                className="text-xs font-bold whitespace-nowrap overflow-hidden text-slate-900 dark:text-slate-100"
                              >
                                {social.username}
                              </motion.span>
                            )}
                          </div>
                        </motion.a>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 font-medium">
                  Follow me for updates, code, and behind-the-scenes.
                </p>
              </div>
            </RevealItem>

            {/* Right Column - Contact Form */}
            <RevealItem className="lg:col-span-3 flex items-center">
              <div className="neu-flat p-6 sm:p-8 md:p-10 rounded-3xl h-auto mx-auto w-full lg:w-[95%] relative">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1 sm:mb-2">Send Me a Message</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-4 sm:mb-6 font-medium">
                  Fill out the form below and I'll get back to you as soon as possible
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
                    <input 
                      type="text" 
                      name="name" 
                      placeholder="Your Name" 
                      value={formState.name} 
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3.5 rounded-2xl neu-inset text-slate-900 dark:text-white transition-all placeholder:text-slate-400 focus:outline-none" 
                    />
                    <input 
                      type="email" 
                      name="email" 
                      placeholder="Your Email" 
                      value={formState.email} 
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3.5 rounded-2xl neu-inset text-slate-900 dark:text-white transition-all placeholder:text-slate-400 focus:outline-none" 
                    />
                  </div>
                  
                  <input 
                    type="text" 
                    name="subject" 
                    placeholder="Subject" 
                    value={formState.subject} 
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3.5 rounded-2xl neu-inset text-slate-900 dark:text-white transition-all placeholder:text-slate-400 focus:outline-none" 
                  />
                  
                  <textarea 
                    name="message" 
                    placeholder="Your Message" 
                    value={formState.message} 
                    onChange={handleChange} 
                    rows={6}
                    required
                    className="w-full px-4 py-3.5 rounded-2xl neu-inset text-slate-900 dark:text-white transition-all resize-none placeholder:text-slate-400 focus:outline-none" 
                  />

                  {formStatus === 'success' && (
                    <div className="flex items-center gap-2.5 p-4 neu-inset rounded-2xl">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                        Message sent successfully! I'll get back to you soon.
                      </p>
                    </div>
                  )}

                  {formStatus === 'error' && (
                    <div className="flex items-center gap-2.5 p-4 neu-inset rounded-2xl">
                      <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                      <p className="text-sm text-rose-600 dark:text-rose-400 font-medium">
                        Something went wrong. Please check console and verify your EmailJS credentials.
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl neu-button-primary text-white font-bold flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer text-sm sm:text-base active:scale-[0.99]"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-slate-200/60 dark:border-slate-800/80">
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 text-center font-medium">
                    I typically respond within 24 hours. For urgent matters, feel free to call or WhatsApp me directly.
                  </p>
                </div>
              </div>
            </RevealItem>
          </div>

          {/* Bottom CTA */}
          <RevealItem className="neu-flat p-8 md:p-12 rounded-3xl text-center">
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-slate-100 mb-3 tracking-tight">
              Ready to Start Your Project?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto text-base sm:text-lg font-medium">
              Let's discuss your ideas and turn them into reality. Whether it's a small task or a large project, I'm here to help you achieve your goals.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://calendly.com/swe-rabiaaziz/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="neu-button-primary px-8 py-4 rounded-full text-white font-bold inline-flex items-center gap-2.5 text-sm sm:text-base transition-transform hover:scale-105 active:scale-95"
              >
                <span>Schedule a 1-1 meeting</span>
                <ArrowRight className="w-5 h-5" />
              </a>
              
              <a
                href="mailto:swe.rabiaaziz@gmail.com"
                className="neu-button px-8 py-4 rounded-full text-slate-800 dark:text-slate-200 font-bold inline-flex items-center gap-2.5 text-sm sm:text-base transition-transform hover:scale-105 active:scale-95"
              >
                <Mail className="w-5 h-5" />
                <span>Send Quick Email</span>
              </a>
            </div>
          </RevealItem>
        </RevealContainer>
      </div>

      <style jsx>{`
        /* Sword draw animation for the header */
        @keyframes sword-draw {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
        .animate-sword-draw {
          animation: sword-draw 2.5s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes pulse-glow-delayed {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .animate-pulse-glow-delayed {
          animation: pulse-glow-delayed 2s ease-in-out infinite 1s;
        }
      `}</style>
    </section>
  );
}
