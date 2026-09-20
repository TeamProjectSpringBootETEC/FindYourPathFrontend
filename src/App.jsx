import React from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import RouteApp from "./Routes/RouteApp";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <div>
        <main>
          {/* <Navbar /> */}
          <RouteApp />
        </main>
      </div>
    </>
  );
}

export default App;
