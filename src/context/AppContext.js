import React, { createContext, useState, useContext } from "react"

const defaultAppState = {
  query: "",
  page: 1,
}

const AppContext = createContext(defaultAppState)

export const CtxProvider = ({ children }) => {
  const [appState, setAppState] = useState(defaultAppState)
  const updateState = _data => {
    setAppState(_data)
  }

  return (
    <AppContext.Provider value={{ appState, updateState }}>
      {children}
    </AppContext.Provider>
  )
}

// make sure use (saves you from importing 'useContext' many times)
export const useGlobalContext = () => {
  const ctx = useContext(AppContext)
  if (ctx === undefined || ctx === null) {
    throw new Error(`useGlobalContext must be called within CtxProvider`)
  }
  return ctx
}
