import { supabase } from '@/lib/supabase'
import PresenteCard from '@/components/PresenteCard'
import SuccessRedirectHandler from '@/components/SuccessRedirectHandler'

import Countdown from '@/components/Countdown'

export const revalidate = 0 

export default async function Home() {
  // Fetch presentes e seus respectivos resgates (se houver)
  const { data: presentes, error } = await supabase
    .from('presentes')
    .select(`
      *,
      resgates (
        nome_convidado,
        foto_convidado_url
      )
    `)
    .order('criado_em', { ascending: true })

  if (error) {
    console.error('Erro ao buscar presentes:', error)
  }

  // Define target date for Countdown (July 25 of next year, or current year depending on when this runs)
  const targetDate = new Date('2026-07-25T18:00:00')

  return (
    <main>
      <SuccessRedirectHandler />
      {/* Hero Section */}
      <section style={{
        backgroundImage: 'url("/hero.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', // Distribui o texto no topo e na base
        alignItems: 'center',
        textAlign: 'center',
        padding: '10vh 2rem 5rem 2rem', // Espaçamento superior e inferior
        position: 'relative'
      }}>
        
        {/* Topo: Save the Date */}
        <div className="animate-fade-in" style={{ width: '100%', maxWidth: '700px', zIndex: 10 }}>
          <img 
            src="/Save-the-date.png" 
            alt="Save the Date" 
            style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
          />
        </div>

        {/* Base: Nomes e Data */}
        <div className="animate-fade-in" style={{ width: '100%', maxWidth: '600px', zIndex: 10, marginBottom: '2rem' }}>
          <img 
            src="/Debora&Sanderson+data.png" 
            alt="Débora e Sanderson - 25 de Julho" 
            style={{ width: '100%', height: 'auto', objectFit: 'contain', filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.3))' }}
          />
        </div>

        {/* Scroll Indicator - Seta para baixo */}
        <a 
          href="#lista-presentes"
          style={{ 
            position: 'absolute', 
            bottom: '0.5rem', 
            left: '50%', 
            marginLeft: '-15px', // Metade da largura para centralizar perfeito
            animation: 'bounceDown 2s infinite',
            cursor: 'pointer',
            zIndex: 20
          }}
        >
          <svg 
            width="30" 
            height="30" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#FFFFFF" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))' }}
          >
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </a>
      </section>

      {/* Introdução aos Convidados */}
      <section style={{ padding: 'var(--spacing-xxl) 0 0', backgroundColor: 'var(--color-bg)' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '0 1rem' }}>
          <h2 style={{ 
            fontFamily: 'var(--font-cursive)', 
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', 
            color: 'var(--color-primary-light)', 
            marginBottom: '1.5rem',
            lineHeight: 1.2
          }}>
            Estamos Animados!
          </h2>
          
          <p style={{ 
            fontSize: '1.25rem', 
            color: 'var(--color-text)', 
            lineHeight: 1.8, 
            marginBottom: '1.5rem' 
          }}>
            A contagem regressiva começou e não vemos a hora de encontrar cada um de vocês para celebrarmos juntos esse momento tão especial das nossas vidas. O nosso maior presente é, sem dúvidas, a sua presença!
          </p>
          
          <p style={{ 
            fontSize: '1.1rem', 
            color: 'var(--color-text-light)', 
            lineHeight: 1.7, 
            marginBottom: '3rem' 
          }}>
            Muitos têm nos perguntado sobre presentes, então preparamos este mural. 
            <br/><br/>
            <strong>Fique à vontade, presentear não é uma regra ou obrigação.</strong> 
            <br/>
            Caso deseje nos mimar com alguma lembrança da lista, ficaremos imensamente felizes e gratos. Se não, seu abraço no grande dia já será inesquecível!
          </p>
          
          <div style={{ 
            width: '60px', 
            height: '2px', 
            backgroundColor: 'var(--color-primary)', 
            margin: '0 auto' 
          }} />
        </div>
      </section>

      {/* Grid de Presentes */}
      <section id="lista-presentes" style={{ padding: 'var(--spacing-xl) 0 var(--spacing-xxl)', backgroundColor: 'var(--color-bg)' }}>
        <div className="container">
          <div className="gifts-grid">
            {presentes && presentes.map((presente) => {
              // Devido à constraint UNIQUE, o Supabase retorna um objeto ao invés de array
              const resgate = Array.isArray(presente.resgates) 
                ? presente.resgates[0] 
                : presente.resgates || null

              return (
                <PresenteCard 
                  key={presente.id}
                  presente={presente}
                  resgate={resgate}
                />
              )
            })}

            {(!presentes || presentes.length === 0) && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--spacing-xxl)', color: 'var(--color-text-light)' }}>
                <p>Nenhum presente listado no momento.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: 'var(--spacing-xl) 0', textAlign: 'center', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-card-bg)' }}>
        <p style={{ color: 'var(--color-text-light)' }}>Com carinho, Sanderson e Debora ❤️</p>
      </footer>
    </main>
  )
}
