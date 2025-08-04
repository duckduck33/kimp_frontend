'use client';

export default function Card({ children, title, className = '' }) {
  return (
    <div className={`bg-gray-800 rounded-lg shadow-lg p-6 min-h-[600px] ${className}`}>
      {title && (
        <h2 className="text-xl font-semibold text-gray-100 mb-4">{title}</h2>
      )}
      {children}
    </div>
  );
}