export default function JsonLd() {
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://swe-rabia-aziz.vercel.app/#website',
        url: 'https://swe-rabia-aziz.vercel.app/',
        name: 'Rabia Aziz',
        alternateName: [
          'Rabia Aziz Portfolio',
          'SWE Rabia Aziz',
          'swe-rabia-aziz',
        ],
        description:
          'Portfolio of Rabia Aziz — Cross-Platform Flutter Developer & Mobile App Engineer.',
        publisher: {
          '@id': 'https://swe-rabia-aziz.vercel.app/#person',
        },
        inLanguage: 'en-US',
      },
      {
        '@type': 'ProfilePage',
        '@id': 'https://swe-rabia-aziz.vercel.app/#profilepage',
        url: 'https://swe-rabia-aziz.vercel.app',
        name: 'Rabia Aziz | Flutter Developer & Mobile App Engineer',
        isPartOf: {
          '@id': 'https://swe-rabia-aziz.vercel.app/#website',
        },
        mainEntity: {
          '@id': 'https://swe-rabia-aziz.vercel.app/#person',
        },
      },
      {
        '@type': 'Person',
        '@id': 'https://swe-rabia-aziz.vercel.app/#person',
        name: 'Rabia Aziz',
        alternateName: ['SWE. Rabia Aziz', 'Rabia Aziz Dev', 'Rabia Aziz Flutter'],
        jobTitle: 'Flutter Developer & Mobile App Engineer',
        disambiguatingDescription:
          'Rabia Aziz is a software engineer and Flutter mobile app developer from Pakistan, known for authoring AI-powered mobile applications including CivicCoach (USCIS Civics 2026) and ZenPeace on the Google Play Store.',
        description:
          'Flutter Developer specializing in AI-powered cross-platform mobile apps, Supabase & Firebase backends, and clean UI/UX architecture.',
        url: 'https://swe-rabia-aziz.vercel.app',
        image: {
          '@type': 'ImageObject',
          url: 'https://swe-rabia-aziz.vercel.app/images/logo.jpg',
          contentUrl: 'https://swe-rabia-aziz.vercel.app/images/logo.jpg',
          caption: 'Rabia Aziz - Official Flutter Developer Personal Brand Logo',
        },
        email: 'swe.rabiaaziz@gmail.com',
        telephone: '+923275676026',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Mingora',
          addressRegion: 'Swat, Khyber Pakhtunkhwa',
          addressCountry: 'PK',
        },
        alumniOf: {
          '@type': 'EducationalOrganization',
          name: 'Virtual University of Pakistan',
          url: 'https://www.vu.edu.pk',
        },
        hasCredential: [
          {
            '@type': 'EducationalOccupationalCredential',
            name: 'Professional Flutter App Development Certification',
            recognizedBy: {
              '@type': 'EducationalOrganization',
              name: 'Arfa Karim Technology Incubator, Peshawar',
            },
          },
        ],
        worksFor: {
          '@type': 'Organization',
          name: 'X Dev Soft',
        },
        sameAs: [
          'https://github.com/swe-rabiaaziz',
          'https://www.linkedin.com/in/rabiaaziz456/',
          'https://www.instagram.com/swe.rabiaaziz/',
          'https://www.facebook.com/swe.rabiaaziz',
          'https://wa.me/923275676026',
          'https://play.google.com/store/apps/details?id=com.us.citizenship.test.naturalization.civics.prep',
          'https://play.google.com/store/apps/details?id=com.ethiopia.zemen.calendar.aqotater.ethiopian.habesha',
          'https://play.google.com/store/apps/details?id=com.zenpeace.pomodoro.focus.timer.mindfulstate',
          'https://play.google.com/store/apps/details?id=com.vitals.bp.family.health.tracker',
        ],
        knowsAbout: [
          'Flutter',
          'Dart',
          'Cross-Platform App Development',
          'Android Development',
          'iOS Development',
          'Supabase',
          'Firebase',
          'Cloud Firestore',
          'AI / LLM Mobile Integration',
          'Google ML Kit',
          'Speech-to-Text & Text-to-Speech',
          'BLoC State Management',
          'Provider State Management',
          'Clean Architecture',
          'Model-View-ViewModel (MVVM)',
          'Drift ORM & SQLite',
          'Mobile UI/UX Design',
        ],
      },
      {
        '@type': 'SoftwareApplication',
        name: 'CivicCoach — AI US Citizenship 2026',
        description:
          'AI-powered Flutter application for USCIS civics prep featuring oral AI mock interviews, spaced-repetition flashcards, and elected officials lookup.',
        operatingSystem: 'Android',
        applicationCategory: 'EducationalApplication',
        url: 'https://play.google.com/store/apps/details?id=com.us.citizenship.test.naturalization.civics.prep&hl=en',
        downloadUrl:
          'https://play.google.com/store/apps/details?id=com.us.citizenship.test.naturalization.civics.prep&hl=en',
        installUrl:
          'https://play.google.com/store/apps/details?id=com.us.citizenship.test.naturalization.civics.prep&hl=en',
        image: 'https://swe-rabia-aziz.vercel.app/images/civic_coach_showcase.jpeg',
        screenshot:
          'https://swe-rabia-aziz.vercel.app/images/civic_coach_showcase.jpeg',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          ratingCount: '120',
          bestRating: '5',
          worstRating: '1',
        },
        author: {
          '@id': 'https://swe-rabia-aziz.vercel.app/#person',
        },
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Ethiopian Calendar — Zemen App',
        description:
          'Feature-rich Ethiopian calendar and date converter with 13-month Geez navigation, live 12-hour clock, and Orthodox fasting schedules.',
        operatingSystem: 'Android',
        applicationCategory: 'UtilitiesApplication',
        url: 'https://play.google.com/store/apps/details?id=com.ethiopia.zemen.calendar.aqotater.ethiopian.habesha&hl=en',
        downloadUrl:
          'https://play.google.com/store/apps/details?id=com.ethiopia.zemen.calendar.aqotater.ethiopian.habesha&hl=en',
        installUrl:
          'https://play.google.com/store/apps/details?id=com.ethiopia.zemen.calendar.aqotater.ethiopian.habesha&hl=en',
        image: 'https://swe-rabia-aziz.vercel.app/images/zemen_showcase.png',
        screenshot:
          'https://swe-rabia-aziz.vercel.app/images/zemen_showcase.png',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '95',
          bestRating: '5',
          worstRating: '1',
        },
        author: {
          '@id': 'https://swe-rabia-aziz.vercel.app/#person',
        },
      },
      {
        '@type': 'SoftwareApplication',
        name: 'ZenPeace — Pomodoro & Mindful Flow',
        description:
          'A minimalist Pomodoro companion built with Flutter and Provider. Offers ambient soundscapes, session analytics, and haptic feedback.',
        operatingSystem: 'Android',
        applicationCategory: 'ProductivityApplication',
        url: 'https://play.google.com/store/apps/details?id=com.zenpeace.pomodoro.focus.timer.mindfulstate&hl=en',
        downloadUrl:
          'https://play.google.com/store/apps/details?id=com.zenpeace.pomodoro.focus.timer.mindfulstate&hl=en',
        installUrl:
          'https://play.google.com/store/apps/details?id=com.zenpeace.pomodoro.focus.timer.mindfulstate&hl=en',
        image: 'https://swe-rabia-aziz.vercel.app/images/zenpeace_showcase.png',
        screenshot:
          'https://swe-rabia-aziz.vercel.app/images/zenpeace_showcase.png',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          ratingCount: '80',
          bestRating: '5',
          worstRating: '1',
        },
        author: {
          '@id': 'https://swe-rabia-aziz.vercel.app/#person',
        },
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Health Tracker — Vitals & BP Monitor',
        description:
          'A personal health companion to record and monitor blood pressure, pulse rate, temperature, and blood glucose with trend charts.',
        operatingSystem: 'Android',
        applicationCategory: 'HealthApplication',
        url: 'https://play.google.com/store/apps/details?id=com.vitals.bp.family.health.tracker&hl=en',
        downloadUrl:
          'https://play.google.com/store/apps/details?id=com.vitals.bp.family.health.tracker&hl=en',
        installUrl:
          'https://play.google.com/store/apps/details?id=com.vitals.bp.family.health.tracker&hl=en',
        image:
          'https://swe-rabia-aziz.vercel.app/images/health_trackor showcase.jpg',
        screenshot:
          'https://swe-rabia-aziz.vercel.app/images/health_trackor showcase.jpg',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '65',
          bestRating: '5',
          worstRating: '1',
        },
        author: {
          '@id': 'https://swe-rabia-aziz.vercel.app/#person',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://swe-rabia-aziz.vercel.app/#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Who is Rabia Aziz?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Rabia Aziz is a software engineer and cross-platform Flutter developer based in Pakistan who specializes in AI-powered mobile applications, Supabase and Firebase backends, and clean UI/UX architecture. She has authored multiple production applications published on the Google Play Store.',
            },
          },
          {
            '@type': 'Question',
            name: 'What mobile applications has Rabia Aziz developed?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Rabia Aziz has published four production mobile apps on Google Play: 1) CivicCoach (USCIS civics prep featuring AI mock interviews), 2) Ethiopian Calendar — Zemen App (13-month Geez navigation and prayer schedules), 3) ZenPeace (a minimalist Pomodoro timer with ambient soundscapes), and 4) Health Tracker (a vitals and blood pressure monitor).',
            },
          },
          {
            '@type': 'Question',
            name: 'What tech stack and backend technologies does Rabia Aziz use?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Her primary mobile framework is Flutter with Dart for iOS, Android, web, and desktop. For backend and databases, she specializes in Supabase (PostgreSQL, Auth, RLS, RPC, Storage) and Firebase. For architecture, she uses Clean Architecture, MVVM, BLoC, Provider, and Drift/SQLite for local storage.',
            },
          },
          {
            '@type': 'Question',
            name: 'What AI and machine learning features does Rabia Aziz build?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'She integrates LLM APIs (Groq, Gemini, OpenAI) and on-device ML with Google ML Kit for speech-to-text oral simulations, optical character recognition (OCR), text-to-speech, and context-aware conversational assistants.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is Rabia Aziz available for hire or remote contracts?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, Rabia Aziz is available worldwide for full-time remote engineering positions, contract development, and freelance mobile applications. She can be reached via email at swe.rabiaaziz@gmail.com or on WhatsApp at +92 327 5676026.',
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
    />
  );
}
