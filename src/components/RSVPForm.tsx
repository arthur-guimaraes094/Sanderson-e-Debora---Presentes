'use client'

import { useState, useTransition } from 'react'
import { submitRSVP } from '@/actions/rsvp'

export default function RSVPForm() {
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [comparecera, setComparecera] = useState<boolean | null>(null)
  const [mensagem, setMensagem] = useState('')
  const [isPending, startTransition] = useTransition()
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '') // Remove tudo que não é dígito
    if (value.length <= 11) {
      // Aplica a máscara 000.000.000-00
      value = value.replace(/(\d{3})(\d)/, '$1.$2')
      value = value.replace(/(\d{3})(\d)/, '$1.$2')
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      setCpf(value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome || !cpf || comparecera === null) {
      setError('Por favor, preencha seu nome, CPF e confirme sua presença.')
      return
    }

    setError('')
    startTransition(async () => {
      const result = await submitRSVP({ nome, cpf, comparecera, mensagem })
      if (result.success) {
        setSubmitted(true)
      } else {
        setError(result.error || 'Ocorreu um erro ao enviar sua confirmação.')
      }
    })
  }

  if (submitted) {
    return (
      <section className="rsvp-section">
        <div className="animate-fade-in" style={{ textAlign: 'center', padding: '2rem' }}>
          <h2 className="rsvp-title">Obrigado!</h2>
          <p style={{ color: '#FFFFFF', fontSize: '1.2rem', marginTop: '1rem' }}>
            {comparecera 
              ? 'Sua presença foi confirmada com sucesso. Mal podemos esperar para te ver!' 
              : 'Sua resposta foi enviada. Sentiremos sua falta, mas agradecemos o carinho!'}
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="rsvp-submit-btn"
            style={{ marginTop: '2rem', fontSize: '1rem', padding: '0.75rem 2rem' }}
          >
            Enviar outra resposta
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="rsvp-section" id="rsvp" style={{ padding: 0 }}>
      {/* Imagem de Topo - Largura Total */}
      <div className="rsvp-hero-container">
        <img 
          src="/background.jpeg" 
          alt="Cerimônia" 
          className="rsvp-hero-img"
        />
      </div>
      
      {/* Container do Formulário com Padding lateral */}
      <div className="container" style={{ padding: '4rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 className="rsvp-title">Confirme sua presença</h2>
        <br />
        <form onSubmit={handleSubmit} className="rsvp-form">
          <div className="rsvp-group">
            <label className="rsvp-label">Seu nome completo*</label>
            <input 
              type="text" 
              className="rsvp-input" 
              placeholder="Digite seu nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              disabled={isPending}
              required
            />
          </div>

          <div className="rsvp-group">
            <label className="rsvp-label">Seu CPF*</label>
            <input 
              type="text" 
              className="rsvp-input" 
              placeholder="000.000.000-00"
              value={cpf}
              onChange={handleCpfChange}
              disabled={isPending}
              required
            />
          </div>

          <div className="rsvp-group">
            <label className="rsvp-label">Você vem?*</label>
            <div className="rsvp-options">
              <button
                type="button"
                className={`rsvp-option ${comparecera === true ? 'selected' : ''}`}
                onClick={() => setComparecera(true)}
                disabled={isPending}
              >
                Claro, não perderia por nada!
              </button>
              <button
                type="button"
                className={`rsvp-option ${comparecera === false ? 'selected' : ''}`}
                onClick={() => setComparecera(false)}
                disabled={isPending}
              >
                Não poderei comparecer
              </button>
            </div>
          </div>

          <div className="rsvp-group">
            <label className="rsvp-label">Deixe sua mensagem para os noivos</label>
            <textarea 
              className="rsvp-input" 
              style={{ minHeight: '100px', resize: 'vertical' }}
              placeholder="Sua mensagem carinhosa..."
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              disabled={isPending}
            />
          </div>

          {error && (
            <p style={{ color: '#ffb7b7', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>
          )}

          <button 
            type="submit" 
            className="rsvp-submit-btn"
            disabled={isPending}
          >
            {isPending ? 'Enviando...' : 'Confirmar'}
          </button>

          <p className="rsvp-footer-text">
            Sua confirmação será enviada diretamente para Sanderson e Débora. Nunca envie senhas.
          </p>
        </form>

        <div className="manual-logo" style={{ marginTop: '4rem' }}>
          <img src="/S&D.svg" alt="S&D Logo" style={{ filter: 'brightness(0) invert(1)' }} />
        </div>
      </div>
    </section>
  )
}
