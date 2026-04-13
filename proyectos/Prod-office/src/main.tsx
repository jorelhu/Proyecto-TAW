import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import "./styles/global.css";
const raiz =createRoot(document.getElementById('root')!)
raiz.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
