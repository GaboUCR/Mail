import React, {useState, createContext } from 'react'

export const EmailContext = createContext()

export const EmailProvider = ({ children }) => {

  const [email, setEmail] = useState("")

  const handleEmailChange = value => {
    setEmail(value)
  }

  const value = {
    email,
    handleEmailChange,
  }

  return <EmailContext.Provider value={value}>{children}</EmailContext.Provider>
}
