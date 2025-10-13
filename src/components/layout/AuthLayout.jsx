import React from 'react';
import Footer from '../ui/Footer';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}