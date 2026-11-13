import { NextResponse } from 'next/server';
import { SYSTEM_PROMPT, TOOLS } from '@/lib/ai-context';

interface LiveProject {
  title: string;
  desc: string;
  tags: string[];
  playstore?: string;
  github?: string;
}

interface LiveTestimonial {
  author: string;
  role: string;
  content: string;
  linkedin?: string;
}

interface PageContext {
  liveProjects?: LiveProject[];
  liveTestimonials?: LiveTestimonial[];
  scannedAt?: string;
}

// Local Smart Knowledge Base Fallback to guarantee 100% intelligent uptime & future-proofing
function getLocalFallbackResponse(
  userPrompt: string,
  pageContext?: PageContext | null
): { reply: string; functionCalls: any[] | null } {
  const query = (userPrompt || '').toLowerCase().trim();

  // 1. Greetings & Pleasantries
  if (/^(hi|hello|hey|greetings|good morning|good evening|good afternoon|what's up|sup)\b/i.test(query)) {
    return {
      reply: "Hello! 👋 I'm Rabia's AI Assistant. I can guide you through her Flutter apps (like CivicCoach, Zemen, ZenPeace & Health Tracker), tech stack, backend expertise in Supabase/Firebase, and senior recommendations, or help you connect directly with her. What would you like to explore?",
      functionCalls: null,
    };
  }

  // 2. Specific Project: CivicCoach — AI US Citizenship Test 2026 (civic_coach_US_citizenship_2026)
  if (
    query.includes('civic') ||
    query.includes('coach') ||
    query.includes('citizenship') ||
    query.includes('naturalization') ||
    query.includes('uscis') ||
    query.includes('n-400') ||
    query.includes('civics')
  ) {
    return {
      reply: "CivicCoach — AI US Citizenship Test 2026 is Rabia's latest flagship Flutter application! 🇺🇸📱\n\nOverview:\nA cutting-edge AI-powered citizenship preparation app for applicants taking the official USCIS Naturalization Civics Test (2026 edition). It combines spaced-repetition study tools, real-time government representative lookup, and AI-driven speech interviews.\n\nKey App Features:\n• 🎙️ AI Voice & Realistic Mock Interviews: Oral interview simulation with Speech-to-Text and AI evaluation simulating real USCIS officer questioning.\n• 📚 Official Civics Questions: 128 & 100 official USCIS civics question bank with audio narration and clear contextual explanations.\n• 🧠 Spaced Repetition Flashcards: Swipeable study card deck powered by the SuperMemo-2 (SM-2) algorithm for rapid long-term memory retention.\n• 🏛️ Dynamic Elected Officials Lookup: Enter your state and ZIP code to automatically look up your governor, senators, and representative.\n• 🌐 Bilingual Localization: Comprehensive English and Spanish support with dual-language question review.\n• ❌ Mistake Bank & Smart Practice: Targeted revision for repeated errors and low-confidence responses.\n• 📊 Real-Time Readiness Score: Exam readiness percentage, daily streak rings, and category mastery.\n\n📲 Available on Google Play Store:\nhttps://play.google.com/store/apps/details?id=com.us.citizenship.test.naturalization.civics.prep&hl=en",
      functionCalls: [{ name: 'scrollToSection', args: { sectionId: 'projects' } }],
    };
  }

  // 3. Specific Project: ZenPeace — Pomodoro Focus & Mindful Flow
  if (
    query.includes('zenpeace') ||
    query.includes('zen peace') ||
    query.includes('pomodoro') ||
    query.includes('focus timer') ||
    query.includes('mindful') ||
    query.includes('meditation')
  ) {
    return {
      reply: "ZenPeace — Pomodoro Focus & Mindful Flow is Rabia's latest live productivity application on the Google Play Store! 🧘‍♂️⏱️\n\nOverview:\nA serene, minimalist Pomodoro timer and mindfulness companion app built with Flutter and Provider. Designed to help users defeat distractions, enter deep flow states, and build sustainable daily focus habits.\n\nKey App Features:\n• ⏱️ Customizable Pomodoro Intervals: Tailored deep-work sessions, short restoration pauses, and long breaks with configurable timers.\n• 🎵 Ambient Audio Soundscapes: Soothing built-in background tracks including calm piano, deep focus, lofi chill, ocean ambient, and zen meditation.\n• 📊 Focus Analytics & Progress Charts: Session tracking, streak rings, and daily/weekly productivity visualization powered by fl_chart.\n• 🔔 Smart Local Notifications & Haptics: Context-aware interval alerts with fine-tuned vibration pulses for uninterrupted focus.\n• 🌿 Serene Minimalist Interface: Distraction-free, aesthetic UI with smooth page transitions and gentle feedback.\n• 💎 In-App Purchases & Premium Unlocks: Full Google Play billing integration for premium audio soundscapes.\n\n📲 Available on Google Play Store:\nhttps://play.google.com/store/apps/details?id=com.zenpeace.pomodoro.focus.timer.mindfulstate&hl=en",
      functionCalls: [{ name: 'scrollToSection', args: { sectionId: 'projects' } }],
    };
  }

  // 4. Specific Project: Ethiopian Calendar — Zemen App
  if (
    query.includes('zemen') ||
    query.includes('ethiopian') ||
    query.includes('habesha') ||
    query.includes('calendar') ||
    query.includes('geez') ||
    query.includes('aqotater')
  ) {
    return {
      reply: "Ethiopian Calendar — Zemen App is Rabia's latest live utility application on Google Play! 🇪🇹📅\n\nOverview:\nA feature-rich Ethiopian Calendar (የኢትዮጵያ ቀን አቆጣጠር) and conversion utility. Features 13-month Geez calendar view, dual Ethiopian-Gregorian date converter, live traditional Ethiopian sunrise clock, Orthodox fasts & saints, Islamic prayer times, and holiday countdowns.\n\nKey App Features:\n• 📅 13-Month Ethiopian Calendar: View all 13 months including Pagume (ጳጉሜ) in month view or year grid, with Gregorian equivalents and Ge'ez numbers (፩, ፪, ፫).\n• 🔄 Dual Date Converter: Seamlessly convert between Ethiopian and Gregorian calendars for any past or future date without internet.\n• ⏰ Traditional Ethiopian Clock & Time: Live analog and digital display of traditional 12-hour sunrise time synced to East Africa Time (EAT), plus world clock.\n• ⛪ Orthodox Tewahedo Fasting & Saints: Complete fasting calendar (Abiy Tsom, Tsome Nenewe, Filseta, Wed/Fri) and daily saints (Kidus Mikael, Mariam, Giorgis, etc.).\n• 🕌 Islamic Prayer Times & Qibla: Accurate prayer times for 12 cities, Qibla compass, and Hijri date integration.\n• 🔔 Events & Reminders: Add birthdays, holidays, and personal recurring reminders by Ethiopian date with ICS export support.\n\n📲 Available on Google Play Store:\nhttps://play.google.com/store/apps/details?id=com.ethiopia.zemen.calendar.aqotater.ethiopian.habesha&hl=en",
      functionCalls: [{ name: 'scrollToSection', args: { sectionId: 'projects' } }],
    };
  }

  // 5. Specific Project: Health Tracker (Vitals & BP Monitor)
  if (
    query.includes('health') ||
    query.includes('tracker') ||
    query.includes('trackor') ||
    query.includes('vitals') ||
    query.includes('blood pressure') ||
    query.includes('bp monitor') ||
    query.includes('glucose') ||
    query.includes('pulse')
  ) {
    return {
      reply: "Health Tracker is Rabia's featured personal health companion mobile app! 🩺📱\n\nOverview:\nDesigned to help users take small, meaningful steps toward healthier tomorrows by monitoring vital signs and wellness trends in one intuitive place.\n\nKey App Features:\n• 📊 Vitals & Blood Pressure Tracking: Easily log systolic and diastolic readings (mmHg) with instant visual classification (Normal, Elevated, etc.).\n• 🌡️ Comprehensive Body Metrics: Log body temperature (°C with fever indicator), blood glucose, and pulse rate.\n• 📈 Weekly Summaries & Trend Charts: Rolling 7-day average trend charts to spot health patterns against normal target ranges.\n• ⚙️ Custom Metric Builder: Create personalized health metrics with custom names, measurement units, accent colors, and custom icons (heart, sleep, weight, hydration).\n• 📋 Health Glance & Organized History: Quick at-a-glance dashboard with most recent readings and organized historical logs.\n• 🌟 Polished Neumorphic UI: Soft, modern interface with color-coded status badges for effortless reading.\n\n📲 Available on Google Play Store:\nhttps://play.google.com/store/apps/details?id=com.vitals.bp.family.health.tracker&hl=en",
      functionCalls: [{ name: 'scrollToSection', args: { sectionId: 'projects' } }],
    };
  }

  // 4. Dynamic Future-Proof Project Lookup (Scans projects found live on the website)
  if (pageContext?.liveProjects && pageContext.liveProjects.length > 0) {
    for (const project of pageContext.liveProjects) {
      const titleLower = project.title.toLowerCase();
      // Check if user's query mentions words from this project's title
      const titleWords = titleLower.split(/[\s—–-]+/).filter((w) => w.length > 2 && w !== 'the' && w !== 'app');
      const isMatch = titleWords.some((word) => query.includes(word));

      if (isMatch) {
        return {
          reply: `Here are the details for ${project.title} from Rabia's portfolio: 📱\n\nOverview:\n${project.desc}\n\nTags: ${project.tags.join(', ')}${project.playstore ? `\n\n📲 Google Play Store: ${project.playstore}` : ''}${project.github ? `\n\n💻 GitHub: ${project.github}` : ''}\n\nWould you like me to scroll down to view it in the Projects showcase?`,
          functionCalls: [{ name: 'scrollToSection', args: { sectionId: 'projects' } }],
        };
      }
    }
  }

  // 5. Projects & Work Showcase (General Query)
  if (
    query.includes('project') ||
    query.includes('work') ||
    query.includes('build') ||
    query.includes('portfolio') ||
    query.includes('apps') ||
    query.includes('showcase')
  ) {
    const liveProjectList = pageContext?.liveProjects?.length
      ? pageContext.liveProjects.map((p) => `• 📱 ${p.title}: ${p.desc}`).join('\n')
      : "• 📱 CivicCoach — AI US Citizenship Test 2026: Official USCIS 2026 prep with AI voice mock interviews, 128 questions, and elected officials lookup.\n• 📱 Ethiopian Calendar — Zemen App: Feature-rich 13-month Geez calendar, dual offline date converter, live sunrise clock, and Orthodox fasts.\n• 📱 ZenPeace — Pomodoro Focus & Mindful Flow: A serene Pomodoro timer with ambient soundscapes, focus analytics, and mindfulness tools.\n• 📱 Health Tracker — Vitals & BP Monitor: A personal health companion for logging blood pressure, body temperature, pulse rate, and tracking weekly trend averages.";

    return {
      reply: `Rabia has built 10+ battle-tested mobile, web, and desktop applications using Flutter, Dart, Supabase, and Firebase.\n\nFeatured Projects on her website:\n${liveProjectList}\n\nExplore her Projects showcase or check out her GitHub at https://github.com/swe-rabiaaziz !`,
      functionCalls: [{ name: 'scrollToSection', args: { sectionId: 'projects' } }],
    };
  }

  // 5. Testimonials & Senior Endorsements
  if (
    query.includes('testimonial') ||
    query.includes('review') ||
    query.includes('recommend') ||
    query.includes('feedback') ||
    query.includes('senior') ||
    query.includes('mentor') ||
    query.includes('lead') ||
    query.includes('afaq') ||
    query.includes('uzair') ||
    query.includes('ubaid')
  ) {
    if (query.includes('afaq')) {
      return {
        reply: "Here is the endorsement from Afaq Zahir (Team Lead & Software Engineer @ Apptex Software Solutions):\n'Working with Rabia has been an absolute pleasure. As her mentor and team lead, I've watched her tackle complex Flutter challenges with remarkable speed and dedication. She writes clean, maintainable code, grasps complex UI/UX designs effortlessly, and consistently delivers high-performance mobile features ahead of schedule.'\n\nLinkedIn: https://www.linkedin.com/in/afaqxdev/",
        functionCalls: [{ name: 'scrollToSection', args: { sectionId: 'testimonials' } }],
      };
    }

    if (query.includes('uzair')) {
      return {
        reply: "Here is the endorsement from Muhammad Uzair (Lead Software Engineer @ Metasense):\n'Collaborating with Rabia in our remote team has been fantastic. She is an exceptionally skilled Flutter developer with strong technical initiative. Whenever she builds an application and walks through its implementation, her attention to clean code, modular architecture, and rapid execution always stands out. She communicates proactively and consistently ships dependable, high-quality mobile apps.'\n\nLinkedIn: https://www.linkedin.com/in/uzairxdev/",
        functionCalls: [{ name: 'scrollToSection', args: { sectionId: 'testimonials' } }],
      };
    }

    if (query.includes('ubaid')) {
      return {
        reply: "Here is the endorsement from Ubaid Ullah (Flutter Team Lead @ Trisol Technologies):\n'Working with Rabia as her team lead has been an absolute pleasure. She brings extraordinary dedication and craftsmanship to every application she builds, consistently maintaining high engineering standards. What truly sets her apart is her natural flair for UI design and silky-smooth animations—she crafts fluid, visually captivating mobile experiences that feel lively, intuitive, and modern.'\n\nLinkedIn: https://www.linkedin.com/in/ubaidxdev/",
        functionCalls: [{ name: 'scrollToSection', args: { sectionId: 'testimonials' } }],
      };
    }

    return {
      reply: "Here is what engineering team leads and seniors say about working with Rabia:\n• Afaq Zahir (Team Lead @ Apptex Software Solutions): 'Exceptionally dedicated Flutter engineer... delivers production-ready mobile apps ahead of schedule.'\n• Muhammad Uzair (Lead SWE @ Metasense): 'Exceptionally skilled Flutter developer with strong technical initiative... attention to clean code, modular architecture, and rapid execution.'\n• Ubaid Ullah (Flutter Team Lead @ Trisol Technologies): 'Natural talent for UI design and silky-smooth animations... creates responsive, visually captivating mobile experiences.'\n\nYou can click their LinkedIn profiles directly in the Testimonials section!",
      functionCalls: [{ name: 'scrollToSection', args: { sectionId: 'testimonials' } }],
    };
  }

  if (query.includes('instagram') || query.includes('insta')) {
    return {
      reply: "You can follow Rabia Aziz on Instagram: https://www.instagram.com/swe.rabiaaziz/ (@swe.rabiaaziz)!",
      functionCalls: null,
    };
  }

  // 6. LinkedIn & Social Links
  if (query.includes('linkedin')) {
    return {
      reply: "You can connect with Rabia Aziz on LinkedIn here: https://www.linkedin.com/in/swe-rabiaaziz/ — Feel free to send her a connection request or message for collaboration!",
      functionCalls: null,
    };
  }

  if (query.includes('github') || query.includes('repo') || query.includes('source code')) {
    return {
      reply: "Explore Rabia's open-source projects and code repositories on GitHub: https://github.com/swe-rabiaaziz (@swe-rabiaaziz)",
      functionCalls: null,
    };
  }

  // 7. Contact, Email, WhatsApp & Hiring
  if (
    query.includes('contact') ||
    query.includes('email') ||
    query.includes('reach') ||
    query.includes('phone') ||
    query.includes('whatsapp') ||
    query.includes('hire') ||
    query.includes('meeting') ||
    query.includes('calendly') ||
    query.includes('connect')
  ) {
    return {
      reply: "You can reach Rabia directly through any of these channels:\n• 📧 Email: swe.rabiaaziz@gmail.com\n• 💬 WhatsApp: +92 327 5676026 (https://wa.me/923275676026)\n• 📅 Schedule a 1-on-1 Call: https://calendly.com/swe-rabiaaziz/30min\n• 💼 LinkedIn: https://www.linkedin.com/in/swe-rabiaaziz/\n\nShe is based in Swat, Pakistan and available worldwide for full-time remote roles and freelance projects!",
      functionCalls: [{ name: 'scrollToSection', args: { sectionId: 'contact' } }],
    };
  }

  // 8. Skills & Tech Stack
  if (
    query.includes('skill') ||
    query.includes('flutter') ||
    query.includes('supabase') ||
    query.includes('firebase') ||
    query.includes('dart') ||
    query.includes('tech') ||
    query.includes('stack') ||
    query.includes('ai') ||
    query.includes('ml') ||
    query.includes('bloc') ||
    query.includes('architecture')
  ) {
    return {
      reply: "Rabia specializes in 6 core technical areas:\n1. 📱 Cross-Platform App Dev: Flutter, Dart, iOS, Android, Flutter Web & Desktop.\n2. ☁️ Backend & Cloud: Supabase (Auth, Storage, RPC), Firebase (Firestore, Cloud Functions), REST APIs.\n3. 🏗️ State & Architecture: BLoC / Cubit, Provider, MVVM, Clean Architecture.\n4. 🧠 AI/ML Integration: Groq LLM API, Google ML Kit, OCR, Speech-to-Text.\n5. 💾 Local Databases: Drift ORM, SQFlite, SQLite, Hive, SharedPreferences.\n6. 🛠️ Ecosystem: Git/GitHub, CI/CD, In-App Purchases, Google Maps, i18n Localization, App Store & Google Play deployment.",
      functionCalls: [{ name: 'scrollToSection', args: { sectionId: 'skills' } }],
    };
  }

  // 9. Resume & CV
  if (query.includes('resume') || query.includes('cv')) {
    return {
      reply: "Here is Rabia's latest official resume: https://drive.google.com/file/d/1xAb2h17uqQ9PtSzpiO2XRSF1BU8fn-A5/view?usp=drive_link — Feel free to review her background and qualifications!",
      functionCalls: [{ name: 'openResume', args: {} }],
    };
  }

  // 10. Experience, Education & Work History
  if (
    query.includes('experience') ||
    query.includes('job') ||
    query.includes('work history') ||
    query.includes('x dev') ||
    query.includes('arfa') ||
    query.includes('education') ||
    query.includes('university') ||
    query.includes('study')
  ) {
    return {
      reply: "Rabia's journey in software engineering:\n• 💼 Junior Flutter Developer at X dev Soft (2025 - Present): Building production mobile apps, API integrations, and scalable UI architectures.\n• 🎓 Arfa Karim Technology Incubator, Peshawar (Sept 2025): Intensive 3-month advanced Flutter & Firebase program.\n• 🏛️ BS in Software Engineering at Virtual University of Pakistan (Ongoing).",
      functionCalls: [{ name: 'scrollToSection', args: { sectionId: 'experience' } }],
    };
  }

  // 11. Certifications
  if (query.includes('certif') || query.includes('credential')) {
    return {
      reply: "Rabia holds 3 recognized certifications:\n1. Flutter App Development — Arfa Karim Technology Incubator (Sept 2025)\n2. Digital Skills & Freelancing — KP-TEVTA / Helvetas Pakistan (2021)\n3. NCVQ IT - Computer Operator — KP Trade Testing Board (2021)\nAll certificates are verified and viewable in her Experience section!",
      functionCalls: [{ name: 'scrollToSection', args: { sectionId: 'experience' } }],
    };
  }

  // 12. Boss Arrival Demonstration / Show Me Something Cool / Surprise Me
  if (
    query.includes('cool') ||
    query.includes('surprise') ||
    query.includes('boss') ||
    query.includes('animation') ||
    query.includes('interesting') ||
    query.includes('secret') ||
    query.includes('easter egg')
  ) {
    return {
      reply: "Here is something cool — take a look at the signature animation showcase! ✨🗡️",
      functionCalls: [{ name: 'triggerEasterEgg', args: {} }],
    };
  }

  // 13. About / Who is Rabia (Bio)
  if (
    query.includes('who is') ||
    query.includes('bio') ||
    query.includes('tell me about her') ||
    query === 'about' ||
    query === 'about rabia' ||
    query.includes('background')
  ) {
    return {
      reply: "Rabia Aziz is a passionate Software Engineer and Flutter App Developer with 1+ years of experience and 10+ completed applications. She specializes in building AI-powered mobile apps, scalable Supabase/Firebase backends, and responsive UI that feels smooth and intuitive. Would you like to check her projects (like CivicCoach, Zemen & ZenPeace), technical skills, or get in touch?",
      functionCalls: [{ name: 'scrollToSection', args: { sectionId: 'about' } }],
    };
  }

  // 14. Smart Fallback
  return {
    reply: "I'm here to help you learn all about Rabia Aziz! You can ask about her featured Flutter apps (like CivicCoach & Health Tracker), technical skill set, senior endorsements, certifications, work experience at X dev Soft, or how to get in touch with her.",
    functionCalls: null,
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const messages = body.messages || [];
    const pageContext: PageContext | null = body.pageContext || null;
    const userMessage = messages[messages.length - 1]?.content || '';

    const apiKey = process.env.GEMINI_API_KEY?.trim();

    // If key is missing, placeholder, or invalid format, return local fallback with live web context
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE' || !apiKey.startsWith('AIzaSy')) {
      return NextResponse.json(getLocalFallbackResponse(userMessage, pageContext));
    }

    // Build dynamic system instruction with live website state for future-proofing
    let dynamicSystemPrompt = SYSTEM_PROMPT;
    if (pageContext?.liveProjects?.length || pageContext?.liveTestimonials?.length) {
      dynamicSystemPrompt += `\n\nCURRENT LIVE WEBPAGE CONTENT (SCANNED LIVE FROM BROWSER):\n${JSON.stringify(pageContext, null, 2)}\nIMPORTANT: Always prioritize this live website content when answering questions about projects, testimonials, and features!`;
    }

    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(msg.content || '') }],
    }));

    const payload = {
      systemInstruction: {
        parts: [{ text: dynamicSystemPrompt }],
      },
      contents: formattedMessages,
      tools: TOOLS,
    };

    const modelsToTry = [
      'gemini-2.0-flash',
      'gemini-1.5-flash',
      'gemini-1.5-flash-latest',
    ];

    let responseData: any = null;

    for (const modelName of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const text = await response.text();
          try {
            const data = JSON.parse(text);
            if (data.candidates?.[0]) {
              responseData = data;
              break;
            }
          } catch {
            // Continue
          }
        }
      } catch {
        // Continue to next model
      }
    }

    if (!responseData) {
      return NextResponse.json(getLocalFallbackResponse(userMessage, pageContext));
    }

    const candidate = responseData.candidates[0];
    const parts = candidate?.content?.parts || [];

    let reply = '';
    const functionCalls: any[] = [];

    parts.forEach((part: any) => {
      if (part.text) {
        reply += part.text;
      }
      if (part.functionCall) {
        functionCalls.push({
          name: part.functionCall.name,
          args: part.functionCall.args,
        });
      }
    });

    const fallbackResult = getLocalFallbackResponse(userMessage, pageContext);

    return NextResponse.json({
      reply: reply.trim() || fallbackResult.reply,
      functionCalls: functionCalls.length > 0 ? functionCalls : fallbackResult.functionCalls,
    });
  } catch (error) {
    console.error('API Chat Exception:', error);
    return NextResponse.json(getLocalFallbackResponse('', null));
  }
}
