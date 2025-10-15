import React from 'react'
import Header from '../ui/Header'
import Footer from '../ui/Footer'

/**
 * 🏠 AUTH LAYOUT COMPONENT
 * 📍 Layout para páginas de autenticación (con footer)
 */
export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}