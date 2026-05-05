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
        className="gift-card-container"
        onClick={() => {
          if (!isSold) setIsModalOpen(true)
        }}
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        }}
      >
        <div className="gift-card-frame">
          {/* Cantos adicionais da moldura */}
          <div className="gift-card-corner-tr"></div>
          <div className="gift-card-corner-bl"></div>

          {/* Imagem do Presente */}
          <div className="gift-card-img-wrapper">
            {presente.imagem_url && (
              <img 
                src={presente.imagem_url} 
                alt={presente.nome} 
                style={{
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
                maxWidth: '220px',
                aspectRatio: '0.85 / 1',
                transform: 'rotate(-3deg)',
                transition: 'transform 0.3s ease'
              }}>
                {/* Foto do convidado */}
                {resgate.foto_convidado_url && (
                  <img 
                    src={resgate.foto_convidado_url} 
                    alt={resgate.nome_convidado}
                    style={{
                      position: 'absolute',
                      top: '8%',
                      left: '8%',
                      width: '84%',
                      height: '70%',
                      objectFit: 'cover',
                      zIndex: 1
                    }}
                  />
                )}

                {/* Moldura Polaroid */}
                <img 
                  src="/moldura-polaroid.png" 
                  alt="Polaroid"
                  style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    zIndex: 2,
                    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))',
                    objectFit: 'contain'
                  }}
                />

                <div style={{
                  position: 'absolute',
                  bottom: '2%',
                  left: '5%',
                  width: '90%',
                  height: '19%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  zIndex: 3
                }}>
                  <span style={{ 
                    fontFamily: 'var(--font-cursive)', 
                    fontSize: 'clamp(0.8rem, 3.5vw, 1.2rem)',
                    color: '#2C363F',
                    lineHeight: 1.1,
                    wordBreak: 'break-word'
                  }}>
                    {resgate.nome_convidado.trim().split(' ')[0]}
                  </span>
                </div>
              </div>
            </div>
          ) : null}

          {/* Seção de informações (visível apenas para disponíveis, mas mantém o espaço no sold) */}
          <div className="gift-card-info" style={{ visibility: isSold ? 'hidden' : 'visible' }}>
            <h3 className="gift-card-name" title={presente.nome}>{presente.nome}</h3>
            <br />
            <div className="gift-card-pill-price">
              {new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(presente.valor)}
            </div>
          </div>
        </div>
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
