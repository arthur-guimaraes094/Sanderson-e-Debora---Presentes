'use client'

import { useState, useRef, useEffect } from 'react'
import ResgateForm from './ResgateForm'
import ThankYouModal from './ThankYouModal'

interface Presente {
  id: string
  nome: string
  valor: number
  imagem_url: string
}

interface Resgate {
  nome_convidado: string
  foto_convidado_url: string
}

interface PresenteCardProps {
  presente: Presente
  resgate?: Resgate | null
}

export default function PresenteCard({ presente, resgate }: PresenteCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [successName, setSuccessName] = useState<string | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" })

    const currentRef = cardRef.current
    if (currentRef) observer.observe(currentRef)

    return () => {
      if (currentRef) observer.unobserve(currentRef)
    }
  }, [])

  const isSold = !!resgate

  return (
    <>
      <div 
        ref={cardRef}
        style={{
          backgroundColor: 'var(--color-card-bg)',
          borderRadius: 'var(--border-radius-md)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
          transition: 'transform 0.6s ease-out, box-shadow var(--transition-normal), opacity 0.6s ease-out',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          minHeight: '250px' // Garante altura mínima para o polaroid caber bem
        }}
        onMouseEnter={(e) => {
          if (!isSold) {
            e.currentTarget.style.transform = 'translateY(-5px)'
            e.currentTarget.style.boxShadow = 'var(--shadow-md)'
          }
        }}
        onMouseLeave={(e) => {
          if (!isSold) {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
          }
        }}
      >
        {/* Imagem de Fundo (Presente) */}
        <div style={{ position: 'relative', width: '100%', paddingTop: '100%', backgroundColor: '#eee' }}>
          {presente.imagem_url && (
            <img 
              src={presente.imagem_url} 
              alt={presente.nome} 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                // Se for vendido, borramos e deixamos a imagem original do presente opaca
                filter: isSold ? 'grayscale(50%) blur(4px) opacity(40%)' : 'none',
                transition: 'filter 0.3s'
              }}
            />
          )}
        </div>

        {isSold ? (
          /* O Overlay do Polaroid que cobre o card inteiro */
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            padding: '1rem'
          }}>
            <div style={{ 
              position: 'relative', 
              width: '100%', 
              maxWidth: '220px', // Evita que fique gigante no desktop
              aspectRatio: '0.85 / 1', // Proporção aproximada do polaroid
              transform: 'rotate(-3deg)', // Dá um charminho torto
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(2deg) scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(-3deg) scale(1)'}
            >
              {/* Foto do convidado (fica por baixo da moldura) */}
              {resgate.foto_convidado_url && (
                <img 
                  src={resgate.foto_convidado_url} 
                  alt={resgate.nome_convidado}
                  style={{
                    position: 'absolute',
                    top: '8%',      // Ajustes finos dependendo do PNG da moldura
                    left: '8%',
                    width: '84%',
                    height: '70%',
                    objectFit: 'cover',
                    zIndex: 1
                  }}
                />
              )}

              {/* A moldura PNG com centro vazado */}
              <img 
                src="/moldura-polaroid.png" 
                alt="Polaroid"
                style={{
                  position: 'absolute',
                  top: 0, left: 0, width: '100%', height: '100%',
                  zIndex: 2,
                  filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.4))',
                  objectFit: 'contain'
                }}
              />

              <div style={{
                position: 'absolute',
                bottom: '2%', // Desce mais um pouquinho para a ponta do polaroid
                left: '5%',
                width: '90%',
                height: '18%', // Ocupa rigorosamente apenas o espaço branco do final
                display: 'flex',
                alignItems: 'center', // Se ficar grande, cresce para baixo e para cima, mas como a altura é 18%, e a foto acaba em 78%, não deve passar.
                justifyContent: 'center',
                textAlign: 'center',
                zIndex: 3,
                overflow: 'hidden' // Corta o que passar
              }}>
                <span style={{ 
                  fontFamily: 'var(--font-cursive)', 
                  fontSize: 'clamp(0.8rem, 3.5vw, 1.2rem)', // Fonte reduzida para caber nomes como "Arthur e Gabi" em 2 linhas sem estourar
                  color: '#2C363F',
                  lineHeight: 0.9, // Reduz o espaço entre as linhas
                  display: '-webkit-box',
                  WebkitLineClamp: 2, // Permite 2 linhas
                  WebkitBoxOrient: 'vertical',
                  wordBreak: 'break-word'
                }}>
                  {resgate.nome_convidado}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Conteúdo Normal (se não foi vendido) */
          <div className="gift-card-content">
            <h3 className="gift-card-title" title={presente.nome}>{presente.nome}</h3>
            <p className="gift-card-price">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(presente.valor)}
            </p>

            <div style={{ marginTop: 'auto' }}>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="btn btn-primary gift-card-btn"
              >
                Resgatar
              </button>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && !isSold && (
        <ResgateForm 
          presenteId={presente.id}
          presenteNome={presente.nome}
          onClose={() => setIsModalOpen(false)}
          onSuccess={(nome) => setSuccessName(nome)}
        />
      )}

      {successName && (
        <ThankYouModal 
          guestName={successName} 
          onClose={() => setSuccessName(null)} 
        />
      )}
    </>
  )
}
