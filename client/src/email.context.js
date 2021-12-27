import {React, useState, createContext } from 'react'

export const EmailContext = createContext()

export const EmailProvider = ({ children }) => {




  // This has to be changed!!!
  const [email, setEmail] = useState("Gabriel")

  const handleEmailChange = value => {
    setEmail(value)
  }

  const value = {
    email,
    handleEmailChange,
  }

  return <EmailContext.Provider value={value}>{children}</EmailContext.Provider>
}
