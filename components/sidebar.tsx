"use client"

import { Github, Linkedin, Mail, ExternalLink } from "lucide-react"
import { useState } from "react"

// Custom WhatsApp Icon Component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
)

export default function SocialSidebar() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      const navbarHeight = 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navbarHeight,
        behavior: "smooth",
      });
    }
  };

  const socials = [
    {
      icon: Github,
      label: "GitHub",
      url: "https://github.com/swe-rabiaaziz",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/swe-rabiaaziz/",
    },
    {
      icon: WhatsAppIcon,
      label: "WhatsApp",
      url: "https://wa.me/923275676026",
    },
    {
      icon: Mail,
      label: "Email",
      url: "mailto:swe.rabiaaziz@gmail.com",
    },
  ]

  return (
    <div className="hidden md:flex fixed right-1.5 sm:right-3 lg:right-6 top-[46%] sm:top-[42%] lg:top-1/4 lg:bottom-0 z-40 flex-col items-center animate-sidebar-float select-none">

      {/* Top Anchor: The Kunai stabbed into the top of the sidebar (compact on mobile) */}
      <div className="relative z-20 w-3.5 h-9 sm:w-5 sm:h-12 lg:w-8 lg:h-20 text-slate-900 dark:text-slate-300 drop-shadow-[0_10px_10px_rgba(0,0,0,0.4)] -mb-1 sm:-mb-2 lg:-mb-4 animate-kunai-hover">
        <svg viewBox="0 0 24 80" fill="currentColor" className="w-full h-full">
          {/* Blade & Handle */}
          <path d="M12 0 L18 25 L14 30 V60 C14 62 10 62 10 60 V30 L6 25 Z" />
          {/* Ring */}
          <circle cx="12" cy="68" r="6" fill="transparent" stroke="currentColor" strokeWidth="2.5" />
        </svg>
      </div>

      {/* The Taut Ninja Wire: compact and short on mobile, full-length on desktop */}
      <div className="relative flex-grow-0 lg:flex-grow flex flex-col items-center w-full min-h-0 lg:min-h-[300px]">
        {/* The actual wire line */}
        <div className="absolute top-0 bottom-2 lg:bottom-10 w-[1.5px] bg-gradient-to-b from-slate-900 via-slate-600 to-transparent dark:from-slate-300 dark:via-slate-500 shadow-[0_0_8px_rgba(15,23,42,0.6)] z-0"></div>

        {/* Social Icons positioned along the wire */}
        <div className="flex flex-col gap-1.5 sm:gap-2.5 lg:gap-6 pt-1.5 sm:pt-3 lg:pt-8 pb-2 sm:pb-3 lg:pb-12 z-10">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              onMouseEnter={() => setHoveredLink(social.label)}
              onMouseLeave={() => setHoveredLink(null)}
              className="group relative w-7 h-7 sm:w-8 sm:h-8 lg:w-12 lg:h-12 flex items-center justify-center cursor-pointer"
            >

              {/* Hover Effect: Rapidly spinning monochromatic Shuriken */}
              <div className="absolute inset-0 scale-0 opacity-0 group-hover:scale-150 group-hover:opacity-100 transition-all duration-300 ease-out z-0 text-slate-800/80 dark:text-slate-400/80 drop-shadow-[0_0_10px_rgba(15,23,42,0.5)] pointer-events-none">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full animate-spin-hyper">
                  <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0ZM12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" />
                </svg>
              </div>

              {/* The Icon Node */}
              <div className="relative z-10 w-6 h-6 sm:w-7 sm:h-7 lg:w-10 lg:h-10 rounded-full bg-slate-900/95 dark:bg-slate-800/95 border-[1px] lg:border-[1.5px] border-slate-700 dark:border-slate-500 flex items-center justify-center transition-transform duration-200 group-hover:scale-110 shadow-[0_5px_15px_rgba(15,23,42,0.4)]">
                <social.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-slate-200 dark:text-slate-300 group-hover:text-white transition-colors" />
              </div>

              {/* Anime Paper-Bomb Style Tooltip */}
              <div
                className={`absolute right-9 sm:right-11 lg:right-14 origin-right px-2 sm:px-2.5 lg:px-4 py-0.5 sm:py-1 lg:py-2 bg-slate-900 dark:bg-slate-200 text-slate-100 dark:text-slate-900 text-[10px] sm:text-[11px] lg:text-xs font-bold whitespace-nowrap flex items-center gap-1 sm:gap-1.5 lg:gap-2 shadow-[0_5px_15px_rgba(0,0,0,0.5)] transition-all duration-300 ease-out z-50 ${hoveredLink === social.label
                  ? "scale-100 opacity-100 translate-x-0"
                  : "scale-50 opacity-0 translate-x-4 pointer-events-none"
                  }`}
                style={{ clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0% 100%)" }}
              >
                {social.label}
                <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-70" />
              </div>

              {/* Connecting thread to tooltip */}
              <div className={`absolute right-6 sm:right-8 lg:right-10 top-1/2 w-2.5 sm:w-3 lg:w-4 h-[1.5px] bg-slate-900 dark:bg-slate-300 transition-all duration-300 ${hoveredLink === social.label ? "opacity-100" : "opacity-0"
                }`}></div>
            </a>
          ))}
        </div>
      </div>

      {/* Ninja Wire Terminal: Interactive "Hire Me" Node (nested neatly on mobile, bottom-docked on desktop) */}
      <div className="relative mt-1 lg:mt-0 lg:absolute lg:bottom-6 z-20 flex flex-col items-center">
        {/* Wire connector bead */}
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-slate-800 dark:bg-slate-300 border border-slate-600 dark:border-slate-400 -mb-0.5 z-30 shadow-sm" />

        <button
          onClick={scrollToContact}
          onMouseEnter={() => setHoveredLink("Hire Me")}
          onMouseLeave={() => setHoveredLink(null)}
          className="group/hire relative flex items-center gap-1 sm:gap-1.5 lg:gap-2 px-1.5 sm:px-2.5 lg:px-3.5 py-0.5 sm:py-1 lg:py-1.5 rounded-full bg-slate-900/95 dark:bg-slate-800/95 border-[1px] lg:border-[1.5px] border-slate-700 dark:border-slate-500 hover:border-slate-400 dark:hover:border-slate-300 shadow-[0_6px_18px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:shadow-[0_6px_22px_rgba(16,185,129,0.3)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer select-none"
          title="Click to get in touch"
          aria-label="Hire Me - Available for projects"
        >
          {/* Subtle spinning Shuriken on hover */}
          <div className="absolute inset-0 scale-0 opacity-0 group-hover/hire:scale-125 group-hover/hire:opacity-100 transition-all duration-300 ease-out z-0 text-slate-700/30 dark:text-slate-400/30 pointer-events-none">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full animate-spin-hyper">
              <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0ZM12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" />
            </svg>
          </div>

          {/* Green Chakra Pulse Indicator */}
          <div className="relative flex items-center justify-center w-2 h-2 sm:w-2.5 sm:h-2.5 z-10 flex-shrink-0">
            <div className="absolute w-3 h-3 sm:w-3.5 sm:h-3.5 bg-emerald-500/50 dark:bg-emerald-400/50 rounded-full animate-ping" />
            <div className="absolute w-4 h-4 sm:w-5 sm:h-5 bg-emerald-500/25 dark:bg-emerald-400/25 rounded-full animate-pulse" />
            <div className="relative w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
          </div>

          {/* Text: HIRE ME */}
          <span className="relative z-10 text-[8px] sm:text-[9px] lg:text-[10px] font-extrabold uppercase tracking-widest text-slate-200 dark:text-slate-200 group-hover/hire:text-white transition-colors whitespace-nowrap leading-none">
            Hire Me
          </span>

          {/* Anime Paper-Bomb Style Tooltip */}
          <div
            className={'absolute right-full mr-2 sm:mr-3 origin-right px-2 sm:px-3 py-1 sm:py-1.5 bg-slate-900 dark:bg-slate-200 text-slate-100 dark:text-slate-900 text-[10px] sm:text-xs font-bold whitespace-nowrap flex items-center gap-1.5 shadow-[0_5px_15px_rgba(0,0,0,0.5)] transition-all duration-300 ease-out z-50 ' + (hoveredLink === "Hire Me" ? "scale-100 opacity-100 translate-x-0" : "scale-50 opacity-0 translate-x-4 pointer-events-none")}
            style={{ clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0% 100%)" }}
          >
            <span>Available for Hire</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </div>

          {/* Connecting thread to tooltip */}
          <div
            className={'absolute right-full w-2 sm:w-3 top-1/2 -translate-y-1/2 h-[1.5px] bg-slate-900 dark:bg-slate-300 transition-all duration-300 ' + (hoveredLink === "Hire Me" ? "opacity-100" : "opacity-0")}
          />
        </button>
      </div>

      <style jsx>{`
        /* Hyper-fast spin for the shuriken hover */
        @keyframes spin-hyper {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-hyper {
          animation: spin-hyper 0.8s linear infinite;
        }

        /* Noticeable vertical float for the entire sidebar */
        @keyframes sidebar-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .animate-sidebar-float {
          animation: sidebar-float 5s ease-in-out infinite;
        }

        /* Subtle vertical drift for the Kunai to look like it's holding tension */
        @keyframes kunai-hover {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-kunai-hover {
          animation: kunai-hover 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
