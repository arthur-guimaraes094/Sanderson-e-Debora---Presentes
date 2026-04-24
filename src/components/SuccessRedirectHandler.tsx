'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import ThankYouModal from './ThankYouModal'

function RedirectHandlerContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [guestName, setGuestName] = useState<string | null>(null)

  useEffect(() => {
    const success = searchParams.get('success')
    const guest = searchParams.get('guest')

    if (success === 'true' && guest) {
      setGuestName(guest)
      
      // Limpa os parâmetros da URL sem recarregar a página
      const newUrl = window.location.pathname
      window.history.replaceState({}, '', newUrl)
    }
  }, [searchParams])

  if (!guestName) return null

  return (
    <ThankYouModal 
      guestName={guestName} 
      onClose={() => setGuestName(null)} 
    />
  )
}

export default function SuccessRedirectHandler() {
  return (
    <Suspense fallback={null}>
      <RedirectHandlerContent />
    </Suspense>
  )
}
