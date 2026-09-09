import React from "react";
import Navbar from "./components/Navbar";
import RouteApp from "./Routes/RouteApp";

function App() {
  return (
    <>
      <div>
        <Navbar />
        <main>
          <RouteApp />
        </main>
      </div>
    </>
  );
}

export default App;
