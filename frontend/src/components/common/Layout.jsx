import React from 'react';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden">

      <Sidebar />

      <main className="w-full px-6 md:px-10 lg:px-14 py-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}