'use client'

import { useState, useEffect } from 'react'

interface TimeLeft {
  dias: number
  horas: number
  minutos: number
  segundos: number
}

export default function Countdown({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ dias: 0, horas: 0, minutos: 0, segundos: 0 })
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date()
      
      if (difference > 0) {
        setTimeLeft({
          dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
          horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutos: Math.floor((difference / 1000 / 60) % 60),
          segundos: Math.floor((difference / 1000) % 60)
        })
      } else {
        setTimeLeft({ dias: 0, horas: 0, minutos: 0, segundos: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  if (!isMounted) return null // Prevent hydration mismatch

  const formatNumber = (num: number) => num.toString().padStart(2, '0')

  return (
    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
      {[
        { label: 'DIAS', value: timeLeft.dias },
        { label: 'HORAS', value: timeLeft.horas },
        { label: 'MINUTOS', value: timeLeft.minutos },
        { label: 'SEGUNDOS', value: timeLeft.segundos }
      ].map((item, index) => (
        <div key={index} style={{
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(197, 161, 101, 0.1)',
          borderRadius: '12px',
          padding: '1.5rem',
          minWidth: '100px',
          textAlign: 'center',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{ 
            fontSize: '2.5rem', 
            fontFamily: 'var(--font-serif)', 
            color: '#E8E5DF', 
            fontWeight: 400,
            lineHeight: 1
          }}>
            {formatNumber(item.value)}
          </div>
          <div style={{ 
            fontSize: '0.65rem', 
            color: 'var(--color-primary)', 
            letterSpacing: '2px', 
            marginTop: '0.75rem',
            fontWeight: 600
          }}>
            {item.label}
          </div>
        </div>
      ))}
    </div>
  )
}
