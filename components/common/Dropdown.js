'use client';

export default function Dropdown({
  value,
  onChange,
  options,
  label,
  className = '',
  error,
}) {
  const baseStyle = 'w-full px-4 py-2 bg-gray-700 border rounded-md focus:outline-none focus:ring-2';
  const borderStyle = error 
    ? 'border-red-500 focus:ring-red-500' 
    : 'border-gray-600 focus:ring-blue-500';

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-200 mb-1">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${baseStyle} ${borderStyle} ${className}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}