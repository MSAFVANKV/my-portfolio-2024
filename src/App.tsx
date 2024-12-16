import { useState } from 'react'
import { Outlet } from "react-router-dom";

import './App.css'
import Navbar from './components/navbar_/Navbar';
import { TabBar } from './components/navbar_/TabBar';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="w-screen scrollbar-none">
        <Navbar/>
        <main className='section_container '>
          <Outlet />
        </main>
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2">
          <TabBar />
        </div>
      
      </div>
    </>
  )
}

export default App
