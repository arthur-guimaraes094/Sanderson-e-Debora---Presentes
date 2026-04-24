'use client'

interface ThankYouModalProps {
  guestName: string
  onClose: () => void
}

export default function ThankYouModal({ guestName, onClose }: ThankYouModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000 }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ 
        padding: '3rem 2rem', 
        backgroundColor: 'var(--color-card-bg)', 
        border: '2px solid var(--color-primary-light)',
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        <h2 style={{ 
          fontFamily: 'var(--font-cursive)', 
          fontSize: '3rem', 
          color: 'var(--color-primary-light)', 
          marginBottom: '1.5rem',
          lineHeight: 1
        }}>
          Muito Obrigado!
        </h2>
        
        <p style={{ 
          fontSize: '1.25rem', 
          color: 'var(--color-text)', 
          lineHeight: 1.6,
          marginBottom: '1rem'
        }}>
          <strong style={{ color: 'var(--color-primary-dark)' }}>{guestName}</strong>,<br/>
          agradecemos de coração por fazer parte deste momento tão especial em nossas vidas e por este presente incrível!
        </p>
        
        <p style={{ 
          marginTop: '1.5rem', 
          fontSize: '1.1rem', 
          color: 'var(--color-text-light)',
          fontFamily: 'var(--font-cursive)'
        }}>
          Com carinho, <br/>
          <span style={{ fontSize: '1.5rem' }}>Sanderson & Débora</span>
        </p>
        
        <button 
          className="btn btn-primary" 
          style={{ marginTop: '2.5rem', width: '100%', padding: '1rem' }}
          onClick={onClose}
        >
          Fechar
        </button>
      </div>
    </div>
  )
}
