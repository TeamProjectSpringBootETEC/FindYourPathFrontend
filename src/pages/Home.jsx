import { useState } from 'react'
import Card from '@/components/Card'
import Button from '@/components/Button'

function Home() {
  const [count, setCount] = useState(0)

  return (
    <section>
      <h1 className="mb-4 text-3xl font-bold">Welcome Home</h1>
      <p>This is a beginner-friendly React + Vite starter.</p>
      <Card title="Try the counter">
        <p>Count: {count}</p>
        {/* state stays in the page, Button just renders — keeps Button reusable elsewhere */}
        <Button onClick={() => setCount((c) => c + 1)}>Add one</Button>
      </Card>
    </section>
  )
}

export default Home
