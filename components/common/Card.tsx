interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export default function Card({ children, title, className = '' }: CardProps) {
  return (
    <div className={`bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}>
      {title && (
        <h2 className="text-xl font-semibold text-gray-100 mb-4">{title}</h2>
      )}
      {children}
    </div>
  );
}