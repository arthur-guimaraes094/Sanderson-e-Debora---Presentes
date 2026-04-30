'use client'

import { useState, useRef, useEffect } from 'react'
import { gerarPagamento } from '@/actions/gerarPagamento'
interface ResgateFormProps {
  presenteId: string
  presenteNome: string
  onClose: () => void
  onSuccess?: (nome: string) => void
}

export default function ResgateForm({ presenteId, presenteNome, onClose, onSuccess }: ResgateFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fotoName, setFotoName] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const errorRef = useRef<HTMLDivElement>(null)

  const compressImage = async (file: File, maxWidth = 1200): Promise<File> => {
    if (!file.type.startsWith('image/')) return file
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target?.result as string
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          if (!ctx) return resolve(file)

          ctx.drawImage(img, 0, 0, width, height)
          
          canvas.toBlob((blob) => {
            if (!blob) return resolve(file)
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            })
            resolve(compressedFile)
          }, 'image/jpeg', 0.8)
        }
        img.onerror = () => resolve(file)
      }
      reader.onerror = () => resolve(file)
    })
  }

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [error])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const formElement = e.currentTarget
      const formData = new FormData()
      
      formData.append('presente_id', presenteId)
      
      const nomeInput = formElement.elements.namedItem('nome') as HTMLInputElement
      formData.append('nome', nomeInput.value)

      const fotoInput = formElement.elements.namedItem('foto') as HTMLInputElement
      
      let fotoFile = fotoInput.files?.[0]

      if (!fotoFile) {
        setError('Por favor, anexe sua foto para o mural.')
        setLoading(false)
        return
      }

      if (!fotoFile.type.startsWith('image/')) {
        setError('O arquivo da foto não é suportado. Por favor, envie uma imagem (JPG, PNG, etc).')
        setLoading(false)
        return
      }

      // Comprime a foto do convidado
      fotoFile = await compressImage(fotoFile)
      formData.append('foto', fotoFile)

      const result = await gerarPagamento(formData)

      if (result?.error) {
        setError(result.error)
      } else if (result?.initPoint) {
        // Sucesso: Redireciona para o Mercado Pago
        window.location.href = result.initPoint
      }
    } catch (err) {
      console.error('Erro no envio do formulário:', err)
      setError('A foto é muito grande ou ocorreu um erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ backgroundColor: '#fef6e5' }}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        <div className="text-center" style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ 
            fontFamily: "'TT Lovelies Script', cursive", 
            fontSize: '3rem', 
            marginBottom: '0.5rem',
            color: 'var(--color-primary)',
            fontWeight: 'normal'
          }}>
            Resgatar Presente
          </h2>
          <p style={{ 
            color: 'var(--color-text-light)', 
            fontSize: '1rem' 
          }}>
            Você está escolhendo: <strong style={{ color: 'var(--color-primary)' }}>{presenteNome}</strong>
          </p>
        </div>

        {error && (
          <div ref={errorRef} style={{ 
            backgroundColor: '#fee2e2', 
            color: '#b91c1c', 
            padding: '1rem', 
            borderRadius: '8px', 
            marginBottom: '1.5rem',
            border: '1px solid #f87171',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            fontSize: '0.95rem'
          }}>
            <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>⚠️</span>
            <div>
              <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Atenção:</strong>
              {error}
            </div>
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="nome" style={{ fontFamily: "'Prata', serif", fontSize: '1.1rem' }}>
              Seu Nome Completo
            </label>
            <input 
              type="text" 
              id="nome" 
              name="nome" 
              className="form-input rsvp-input" 
              placeholder="Ex: João da Silva" 
              style={{ backgroundColor: '#fff', color: '#333' }}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontFamily: "'Prata', serif", fontSize: '1.1rem' }}>
              Sua Foto (Para o mural)
            </label>
            <div className="file-input-wrapper" style={{ 
              border: '2px dashed var(--color-border)',
              padding: '2rem',
              borderRadius: '12px',
              backgroundColor: '#faf9f6'
            }}>
              <span style={{ fontSize: '1.1rem' }}>
                {fotoName ? '📷 Foto selecionada' : 'Clique ou arraste uma foto'}
              </span>
              <input 
                type="file" 
                name="foto" 
                accept="image/*" 
                required 
                onChange={(e) => setFotoName(e.target.files?.[0]?.name || '')}
              />
            </div>
            {fotoName && <div className="file-name" style={{ textAlign: 'center', marginTop: '0.5rem' }}>{fotoName}</div>}
          </div>

          <button 
            type="submit" 
            className={`rsvp-submit-btn ${loading ? 'btn-disabled' : ''}`} 
            style={{ 
              width: '100%', 
              marginTop: '1.5rem', 
              padding: '1.2rem',
              fontSize: '1.1rem',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            disabled={loading}
          >
            {loading ? 'Gerando Pagamento...' : 'Ir para Pagamento (Mercado Pago)'}
          </button>
        </form>
      </div>
    </div>
  )
}
