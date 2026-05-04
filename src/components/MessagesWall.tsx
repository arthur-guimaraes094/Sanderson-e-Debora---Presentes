'use client'

import { useState, useEffect } from 'react'

export interface Mensagem {
  nome: string
  mensagem: string
}

interface MessagesWallProps {
  mensagens: Mensagem[]
}

export default function MessagesWall({ mensagens }: MessagesWallProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (mensagens.length <= 1) return
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % mensagens.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [mensagens.length])

  if (!mensagens || mensagens.length === 0) {
    return null
  }

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '6rem', marginTop: '2rem' }}>
      <div style={{ 
        position: 'relative', 
        height: '240px', 
        width: '100%', 
        maxWidth: '450px',
        display: 'flex',
        justifyContent: 'center',
        perspective: '1000px'
      }}>
        {mensagens.map((msg, index) => {
          // Calcular a distância do index atual (com wrap around)
          let diff = index - activeIndex
          const half = Math.floor(mensagens.length / 2)
          
          if (diff > half) diff -= mensagens.length
          if (diff < -half) diff += mensagens.length

          // Mostrar no máximo as 5 cartas mais próximas do centro para otimização visual
          if (Math.abs(diff) > 2) return null

          const isCenter = diff === 0
          
          // Lógica do leque
          // Cada carta rotaciona um pouco e move no eixo X e Y
          const rotate = diff * 12 // graus de inclinação
          const translateX = diff * 40 // px de afastamento horizontal
          const translateY = Math.abs(diff) * 15 // px descendo as bordas
          const zIndex = 100 - Math.abs(diff)
          const opacity = isCenter ? 1 : Math.max(0.3, 1 - (Math.abs(diff) * 0.35))
          const scale = isCenter ? 1 : 0.95 - (Math.abs(diff) * 0.05)

          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                top: 0,
                width: '75%',
                height: '100%',
                backgroundColor: '#fef6e5',
                borderRadius: '16px',
                padding: '2rem 1.5rem',
                boxShadow: isCenter ? '0 20px 40px rgba(0,0,0,0.4)' : '0 5px 15px rgba(0,0,0,0.1)',
                border: '1px solid #D9D4C7',
                transform: `translateX(${translateX}px) translateY(${translateY}px) rotate(${rotate}deg) scale(${scale})`,
                zIndex: zIndex,
                opacity: opacity,
                transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                cursor: 'pointer',
                transformOrigin: 'bottom center'
              }}
              onClick={() => setActiveIndex(index)}
            >
              <div style={{
                color: 'var(--color-primary)',
                fontFamily: 'var(--font-serif)',
                fontSize: '4rem',
                lineHeight: 0.5,
                opacity: 0.15,
                position: 'absolute',
                top: '30px',
                left: '20px'
              }}>
                "
              </div>
              <p style={{
                color: '#333C36',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.95rem',
                fontStyle: 'italic',
                lineHeight: 1.6,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
                position: 'relative',
                zIndex: 1,
                marginBottom: '1.5rem'
              }}>
                {msg.mensagem}
              </p>
              <p style={{
                color: 'var(--color-primary)',
                fontFamily: 'var(--font-serif)',
                fontWeight: 'bold',
                fontSize: '1rem',
                marginTop: 'auto'
              }}>
                — {msg.nome.split(' ').slice(0, 2).join(' ')}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
