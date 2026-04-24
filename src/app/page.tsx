import { supabase } from '@/lib/supabase'
import PresenteCard from '@/components/PresenteCard'

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
      {/* Hero Section */}
      <section style={{
        backgroundImage: 'url("/hero.png")', // Assumindo que você vai salvar a imagem na pasta public como hero.png
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end', // Joga o contador e o botão para baixo, para não tampar o rosto de vocês
        alignItems: 'center',
        textAlign: 'center',
        padding: '2rem',
        position: 'relative'
      }}>
        <div className="container animate-fade-in" style={{ zIndex: 10, paddingBottom: '3rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {/* A imagem hero.png já contém todo o texto e design necessário */}
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

      {/* Grid de Presentes */}
      <section id="lista-presentes" style={{ padding: 'var(--spacing-xxl) 0', backgroundColor: 'var(--color-bg)' }}>
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
