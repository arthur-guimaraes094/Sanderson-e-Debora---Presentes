import { supabase } from '@/lib/supabase'
import PresenteCard from '@/components/PresenteCard'
import SuccessRedirectHandler from '@/components/SuccessRedirectHandler'

import Countdown from '@/components/Countdown'
import RSVPForm from '@/components/RSVPForm'

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
    .order('nome', { ascending: true })

  if (error) {
    console.error('Erro ao buscar presentes:', error)
  }

  // Define target date for Countdown (July 25 of next year, or current year depending on when this runs)
  const targetDate = new Date('2026-07-25T18:00:00')

  return (
    <main>
      <SuccessRedirectHandler />
      {/* Hero Section */}
      <section className="hero-section">
        
        <div className="animate-fade-in" style={{ width: '100%', maxWidth: '500px', zIndex: 10 }}>
          <img 
            src="/Sanderson & Débora.svg" 
            alt="Sanderson & Débora" 
            style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
          />
        </div>
      </section>

      {/* Introdução aos Convidados */}
      <section className="intro-section">
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center', padding: '0 1rem' }}>
          <img 
            src="/introducao-convidados.svg" 
            alt="Introdução aos Convidados" 
            style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
          />
        </div>
      </section>

      <section className="agenda-section">
        <div className="petals-container">
          <img 
            src="/petalas.svg" 
            alt="" 
            style={{ width: '100%', height: 'auto', display: 'block' }} 
          />
        </div>

        <div className="container" style={{ 
          maxWidth: '1000px', 
          margin: '0 auto', 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4rem'
        }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '4rem',
            flexWrap: 'wrap',
            width: '100%'
          }}>
            <div style={{ maxWidth: '550px', width: '100%' }}>
              <img 
                src="/agenda.svg" 
                alt="Agenda 25 de Julho de 2026" 
                style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.2))' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Seção Localização */}
      <section className="location-section">
        <div className="location-frame">
          <img src="/borda-localizacao.svg" alt="" className="location-border" />
          
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', width: '100%' }}>
            <div className="desktop-only" style={{ 
              borderRadius: '12px', 
              overflow: 'hidden', 
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3969.7422625115964!2d-35.3215266!3d-5.750194899999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7b3ad7b91d9589f%3A0x18ff8721029d8c63!2zVmlsbGFtb3LDoSBSZWNlcMOnw7Vlcw!5e0!3m2!1spt-BR!2sbr!4v1777524122604!5m2!1spt-BR!2sbr" 
                width="100%" 
                height="450" 
                style={{ border: 0, display: 'block' }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <div className="mobile-only" style={{ 
              borderRadius: '12px', 
              overflow: 'hidden', 
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3969.7422625115964!2d-35.3215266!3d-5.750194899999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7b3ad7b91d9589f%3A0x18ff8721029d8c63!2zVmlsbGFtb3LDoSBSZWNlcMOnw7Vlcw!5e0!3m2!1spt-BR!2sbr!4v1777524611210!5m2!1spt-BR!2sbr" 
                width="100%" 
                height="150" 
                style={{ border: 0, display: 'block' }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Manual dos Convidados */}
      <section className="manual-section">
        <h2 className="manual-title">Manual dos convidados</h2>
        
        <div className="manual-list">
          <div className="manual-item">
            <img src="/Confirme sua presenca.svg" alt="Confirme sua presença" />
          </div>
          <div className="manual-item">
            <img src="/Tire fotos.svg" alt="Tire bastante fotos e compartilhe conosco" />
          </div>
          <div className="manual-item">
            <img src="/Evitar atrasos.svg" alt="Se organize com antecedência para evitar atrasos" />
          </div>
          <div className="manual-item">
            <img src="/Traje social.svg" alt="Indicamos o uso de traje social" />
          </div>
          <div className="manual-item">
            <img src="/Aproveite bastante.svg" alt="Aproveite bastante" />
          </div>
        </div>

        <div className="manual-logo">
          <img src="/S&D.svg" alt="S&D Logo" />
        </div>
      </section>

      {/* Versículo Bíblico */}
      <section className="verse-section" style={{ backgroundColor: 'var(--color-bg)', padding: '6rem 1.5rem' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
          <img 
            src="/isaias4120.svg" 
            alt="Isaías 41:20" 
            style={{ width: '100%', maxWidth: '800px', height: 'auto' }} 
          />
        </div>
      </section>

      {/* Intro Lista de Presentes */}
      <section className="gifts-intro" style={{ backgroundColor: 'var(--color-bg)', padding: '0 1.5rem 4rem' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
          <img 
            src="/lista de presentes abaixo.svg" 
            alt="Informações da lista de presentes" 
            style={{ width: '100%', maxWidth: '800px', height: 'auto' }} 
          />
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

      {/* RSVP Section */}
      <RSVPForm />
    </main>
  )
}
