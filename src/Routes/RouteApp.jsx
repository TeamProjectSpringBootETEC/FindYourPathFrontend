import Home from '../pages/Home'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

function RouteApp() {
  return (
    <>
      <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/job" element={<h1 className="p-4 text-2xl font-bold">Job Page</h1>} />
      <Route path="/scholarships" element={<h1 className="p-4 text-2xl font-bold">Scholarships Page</h1>} />
      <Route path="/events" element={<h1 className="p-4 text-2xl font-bold">Events Page</h1>} />
      <Route path="/companies" element={<h1 className="p-4 text-2xl font-bold">Companies Page</h1>} />
      <Route path="/universities" element={<h1 className="p-4 text-2xl font-bold">Universities Page</h1>} />
      <Route path="/about" element={<h1 className="p-4 text-2xl font-bold">About Us Page</h1>} />
    </Routes>
    </>
  )
}

export default RouteApp
