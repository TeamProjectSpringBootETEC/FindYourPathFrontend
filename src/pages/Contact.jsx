import { useState } from 'react'
import Card from '@/components/Card'
import Button from '@/components/Button'

function Contact() {
  const [submitted, setSubmitted] = useState(false)

  // preventDefault stops the browser's default full-page reload on form submit
  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <section>
      <h1 className="mb-4 text-3xl font-bold">Contact</h1>
      <Card title="Send a message">
        {submitted ? (
          <p>Thanks! We&apos;ll get back to you soon.</p>
        ) : (
          <form className="flex flex-col gap-1.5" onSubmit={handleSubmit}>
            <label htmlFor="email" className="mt-2 text-sm text-gray-600">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="rounded-md border border-gray-300 p-2"
            />

            <label htmlFor="message" className="mt-2 text-sm text-gray-600">
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              required
              className="rounded-md border border-gray-300 p-2"
            />

            <Button type="submit" variant="primary" className="mt-3 self-start">
              Send
            </Button>
          </form>
        )}
      </Card>
    </section>
  )
}

export default Contact
