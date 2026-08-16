import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section>
      <h1 className="mb-4 text-3xl font-bold">404 - Page Not Found</h1>
      <p>The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link to="/" className="text-violet-600 hover:underline">
        Go back home
      </Link>
    </section>
  )
}

export default NotFound
