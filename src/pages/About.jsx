import Card from '@/components/Card'

function About() {
  return (
    <section>
      <h1 className="mb-4 text-3xl font-bold">About</h1>
      <Card title="Why this structure?">
        <p>
          Pages live in <code>src/pages</code>, reusable pieces live in{' '}
          <code>src/components</code> — this keeps the codebase easy to navigate as it grows.
        </p>
      </Card>
    </section>
  )
}

export default About
