import React from 'react'
import Home from './components/features/Home'
import {Toaster} from 'sonner'

const App = () => {
  return (
    <>
      <Home />
      <Toaster position="top-right" duration={3000} richColors />
    </>
  )
}

export default App