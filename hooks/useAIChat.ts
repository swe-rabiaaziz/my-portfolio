'use client';

import { useState, useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export type QuickAction = {
  emoji: string;
  label: string;
  subtitle: string;
  val: string;
  fullWidth?: boolean;
};

export function useAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [sendFlash, setSendFlash] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Listen for sidebar toggle event
  useEffect(() => {
    const handler = () => setIsOpen((prev) => !prev);
    window.addEventListener('toggle-ai-chat', handler);
    return () => window.removeEventListener('toggle-ai-chat', handler);
  }, []);

  // Pakistan timezone clock
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString('en-US', {
          timeZone: 'Asia/Karachi',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll inside messages container ONLY
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const executeFunctionCall = async (name: string, args: any) => {
    switch (name) {
      case 'scrollToSection': {
        const el = document.getElementById(args?.sectionId);
        if (el) {
          setIsOpen(false);
          setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
        }
        break;
      }
      case 'openResume':
        window.open(
          'https://drive.google.com/file/d/1-QpVie8mLQpp-96RLKbq697vNbhfo_G1/view?usp=drive_link',
          '_blank'
        );
        break;
      case 'sendEmail':
        try {
          await emailjs.send(
            'service_7v3rlf7',
            'template_dqknllo',
            {
              name: args?.name || 'Anonymous',
              email: args?.email || 'no-reply@portfolio.com',
              message: args?.message || 'Message from AI Chat',
              time: new Date().toLocaleString(),
            },
            'U1PPaPulCP0BM_S8i'
          );
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString() + 'email',
              role: 'assistant',
              content: '📩 Message sent! Rabia will get back to you soon.',
            },
          ]);
        } catch {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString() + 'emailerr',
              role: 'assistant',
              content: 'Failed to send. Please use the Contact section instead.',
            },
          ]);
        }
        break;
      case 'triggerEasterEgg':
        window.dispatchEvent(new CustomEvent('ninja-easter-egg'));
        break;
    }
  };

function extractLiveWebsiteData() {
  if (typeof document === 'undefined') return null;

  try {
    // 1. Live Projects from #projects
    const projectsSection = document.getElementById('projects');
    const liveProjects: Array<{
      title: string;
      desc: string;
      tags: string[];
      playstore?: string;
      github?: string;
    }> = [];

    if (projectsSection) {
      const cards = projectsSection.querySelectorAll('[class*="group relative overflow-hidden"]');
      cards.forEach((card) => {
        const titleEl = card.querySelector('h3');
        const descEl = card.querySelector('p');
        const title = titleEl?.textContent?.trim() || '';
        const desc = descEl?.textContent?.trim() || '';
        if (title && !title.toLowerCase().includes('featured')) {
          const tags: string[] = [];
          card.querySelectorAll('span').forEach((s) => {
            const t = s.textContent?.trim();
            if (t && t.length > 1 && t.length < 25 && !t.includes('Projects') && !t.includes('Featured')) {
              tags.push(t);
            }
          });
          const playstore = (card.querySelector('a[href*="play.google"]') as HTMLAnchorElement)?.href;
          const github = (card.querySelector('a[href*="github"]') as HTMLAnchorElement)?.href;
          liveProjects.push({ title, desc, tags: Array.from(new Set(tags)), playstore, github });
        }
      });
    }

    // 2. Live Testimonials from #testimonials
    const testimonialsSection = document.getElementById('testimonials');
    const liveTestimonials: Array<{
      author: string;
      role: string;
      content: string;
      linkedin?: string;
    }> = [];

    if (testimonialsSection) {
      const author = testimonialsSection.querySelector('h4')?.textContent?.trim() || '';
      const quote = testimonialsSection.querySelector('p[class*="italic"]')?.textContent?.trim() || '';
      const linkedin = (testimonialsSection.querySelector('a[href*="linkedin"]') as HTMLAnchorElement)?.href || '';
      if (author) {
        liveTestimonials.push({ author, role: '', content: quote, linkedin });
      }
    }

    return {
      liveProjects,
      liveTestimonials,
      scannedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    setSendFlash(true);
    setTimeout(() => setSendFlash(false), 400);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const pageContext = extractLiveWebsiteData();
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          pageContext,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString() + 'err',
            role: 'assistant',
            content: `⚠️ ${data.error}`,
          },
        ]);
      } else {
        if (data.reply) {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString() + 'ai',
              role: 'assistant',
              content: data.reply,
            },
          ]);
        }
        if (data.functionCalls?.length) {
          for (const call of data.functionCalls) {
            await executeFunctionCall(call.name, call.args);
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + 'err',
          role: 'assistant',
          content: 'Connection failed. Please check your internet and try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions: QuickAction[] = [
    { emoji: '👤', label: 'Her Projects', subtitle: 'Explore her work', val: "Show me Rabia's projects" },
    { emoji: '🛠️', label: 'Skills & Tech', subtitle: 'See her expertise', val: "What are Rabia's skills?" },
    { emoji: '📜', label: 'Open Resume', subtitle: 'View her CV', val: 'Open her resume' },
    { emoji: '📬', label: 'Contact Rabia', subtitle: 'Get in touch', val: 'How can I contact Rabia?' },
    { emoji: '✨', label: 'Surprise Me', subtitle: 'Show something interesting', val: 'Show me something cool', fullWidth: true },
  ];

  return {
    isOpen,
    setIsOpen,
    messages,
    input,
    setInput,
    isLoading,
    currentTime,
    sendFlash,
    messagesContainerRef,
    inputRef,
    handleSend,
    quickActions,
  };
}
