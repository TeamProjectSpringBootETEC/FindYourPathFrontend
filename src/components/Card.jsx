// Reusable box so pages don't repeat the same border/padding markup
function Card({ title, children }) {
  return (
    <div className="mt-4 rounded-lg border border-gray-200 p-5 text-left">
      {title && <h3 className="mb-2 font-semibold">{title}</h3>}
      <div>{children}</div>
    </div>
  )
}

export default Card
