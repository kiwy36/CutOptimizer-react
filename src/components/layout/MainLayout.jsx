import React from 'react';
import Navbar from '../ui/Navbar';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      {/* Footer solo visible en AuthLayout según tu requerimiento */}
    </div>
  );
}