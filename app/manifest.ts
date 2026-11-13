import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Rabia Aziz',
    short_name: 'Rabia Aziz',
    description:
      'Portfolio of Rabia Aziz — Cross-Platform Flutter Developer specializing in AI-powered mobile apps, Supabase & Firebase backends, and clean UI/UX architecture.',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#09090b',
    icons: [
      {
        src: '/images/logo.jpg',
        sizes: 'any',
        type: 'image/jpeg',
      },
    ],
  };
}
