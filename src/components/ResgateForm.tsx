'use client'

import { useState, useRef } from 'react'
import { resgatarPresente } from '@/actions/resgatarPresente'

interface ResgateFormProps {
  presenteId: string
  presenteNome: string
  onClose: () => void
}

export default function ResgateForm({ presenteId, presenteNome, onClose }: ResgateFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fotoName, setFotoName] = useState('')
  const [compName, setCompName] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    formData.append('presente_id', presenteId)

    const result = await resgatarPresente(formData)

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      // Sucesso: apenas fecha o modal e deixa o Next.js revalidar a página
      setLoading(false)
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        <div className="text-center" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Resgatar Presente</h2>
          <p style={{ color: 'var(--color-text-light)' }}>Você está escolhendo: <strong>{presenteNome}</strong></p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'var(--color-error)', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="nome">Seu Nome Completo</label>
            <input 
              type="text" 
              id="nome" 
              name="nome" 
              className="form-input" 
              placeholder="Ex: João da Silva" 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Sua Foto (Para o mural)</label>
            <div className="file-input-wrapper">
              <span>{fotoName ? '📷 Foto selecionada' : 'Clique ou arraste uma foto'}</span>
              <input 
                type="file" 
                name="foto" 
                accept="image/*" 
                required 
                onChange={(e) => setFotoName(e.target.files?.[0]?.name || '')}
              />
            </div>
            {fotoName && <div className="file-name">{fotoName}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Comprovante PIX</label>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>
              Chave PIX: <strong>123.456.789-00</strong> (Sanderson)
            </p>
            <div className="file-input-wrapper">
              <span>{compName ? '📄 Comprovante anexado' : 'Anexar comprovante'}</span>
              <input 
                type="file" 
                name="comprovante" 
                accept="image/*,.pdf" 
                required 
                onChange={(e) => setCompName(e.target.files?.[0]?.name || '')}
              />
            </div>
            {compName && <div className="file-name">{compName}</div>}
          </div>

          <button 
            type="submit" 
            className={`btn btn-primary ${loading ? 'btn-disabled' : ''}`} 
            style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Confirmar Resgate'}
          </button>
        </form>
      </div>
    </div>
  )
}
