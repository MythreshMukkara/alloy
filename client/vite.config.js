/**
 * File: client/vite.config.js
 * Description: Vite configuration for the React client application.
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
