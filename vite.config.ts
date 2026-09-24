import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Link-preview crawlers (Discord, Facebook, X…) need an absolute og:image URL
  // and don't run JS, so the deployed origin is baked into index.html here.
  const siteUrl = (loadEnv(mode, process.cwd(), '').VITE_SITE_URL ?? '').replace(/\/+$/, '')

  return {
    plugins: [
      react(),
      {
        name: 'inject-site-url',
        transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', siteUrl),
      },
    ],
  }
})
