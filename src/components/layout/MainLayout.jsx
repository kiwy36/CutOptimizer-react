import React from 'react'
import Navbar from '../ui/Navbar'

/**
 * 🏢 MAIN LAYOUT COMPONENT
 * 📍 Layout principal para usuarios autenticados (sin footer según requerimiento)
 */
export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      {/* Footer solo visible en AuthLayout según tu requerimiento */}
    </div>
  )
}