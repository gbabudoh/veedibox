import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/dashboard/', '/login', '/register'],
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'Claude-Web', 'ClaudeBot', 'PerplexityBot', 'cohere-ai', 'omgili', 'Google-Extended', 'Applebot-Extended'],
        allow: ['/shop/', '/product/', '/about'],
        disallow: ['/admin/', '/api/', '/dashboard/', '/login', '/register'],
      }
    ],
    sitemap: 'https://veedibox.com/sitemap.xml',
  };
}
