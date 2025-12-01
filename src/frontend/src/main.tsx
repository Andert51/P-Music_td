import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// 🔧 CORS FIX: Patchear createElement ANTES de que se cree cualquier elemento de audio
// Esto asegura que TODOS los elementos <audio> tengan crossOrigin='anonymous'
const originalCreateElement = document.createElement;
document.createElement = function(tagName: any, options?: any) {
  const element = originalCreateElement.call(document, tagName, options);
  if (typeof tagName === 'string' && tagName.toLowerCase() === 'audio') {
    (element as HTMLAudioElement).crossOrigin = 'anonymous';
    console.log('🔧 Audio element created with crossOrigin=anonymous');
  }
  return element;
};
console.log('✅ CORS patch aplicado globalmente desde main.tsx');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
