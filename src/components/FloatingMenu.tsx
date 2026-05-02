'use client'

import { useState } from 'react'

export default function FloatingMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const scrollTo = (id: string) => {
    setIsOpen(false)
    const element = document.getElementById(id)
    if (!element) return

    const offset = 80
    const bodyRect = document.body.getBoundingClientRect().top
    const elementRect = element.getBoundingClientRect().top
    const elementPosition = elementRect - bodyRect
    const offsetPosition = elementPosition - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '2rem', 
      right: '2rem', 
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '1rem'
    }}>
      {/* Opções do Menu */}
      {isOpen && (
        <div className="animate-fade-in" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.75rem',
          marginBottom: '0.5rem'
        }}>
          <button 
            onClick={() => scrollTo('lista-presentes')}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              color: '#1E392A',
              padding: '0.75rem 1.5rem',
              borderRadius: '50px',
              border: '1px solid #D9D4C7',
              fontFamily: "'Prata', serif",
              fontSize: '0.9rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              whiteSpace: 'nowrap',
              transition: 'all 0.3s ease'
            }}
          >
            Lista de Presentes
          </button>
          <button 
            onClick={() => scrollTo('rsvp')}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              color: '#1E392A',
              padding: '0.75rem 1.5rem',
              borderRadius: '50px',
              border: '1px solid #D9D4C7',
              fontFamily: "'Prata', serif",
              fontSize: '0.9rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              whiteSpace: 'nowrap',
              transition: 'all 0.3s ease'
            }}
          >
            Confirmar Presença
          </button>
        </div>
      )}

      {/* Botão Principal (Bolinha) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#1E392A',
          color: '#fef6e5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
          border: '2px solid #fef6e5',
          transition: 'transform 0.3s ease',
          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)'
        }}
      >
        {isOpen ? '✕' : '☰'}
      </button>
    </div>
  )
}
