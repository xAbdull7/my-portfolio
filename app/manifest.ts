import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Portfolio Admin',
    short_name: 'Admin',
    description: 'Admin Dashboard for Portfolio',
    start_url: '/admin',
    display: 'fullscreen',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
        purpose: 'maskable'
      },
      {
        src: '/icon.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
        purpose: 'maskable'
      },
      {
        src: '/icon.jpg',
        sizes: '512x512',
        type: 'image/jpeg'
      }
    ],
  }
}
