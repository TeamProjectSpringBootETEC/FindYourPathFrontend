// Reusable button so every page shares the same look instead of styling its own <button>
const variants = {
  primary: 'bg-violet-600 text-white hover:bg-violet-700',
  secondary: 'border border-gray-300 text-gray-900 hover:bg-gray-50',
}

// className is optional so callers can add layout (margin, self-align) without forking the component
function Button({ children, onClick, type = 'button', variant = 'primary', className = '' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`cursor-pointer rounded-md px-4 py-2 text-sm ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

export default Button
