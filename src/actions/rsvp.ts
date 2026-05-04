'use server'

import { supabaseAdmin } from '@/lib/supabase'

export async function submitRSVP(formData: {
  nome: string
  cpf: string
  comparecera: boolean
  mensagem: string
}) {
  try {
    const { nome, cpf, comparecera, mensagem } = formData

    if (!nome || !cpf) {
      return { success: false, error: 'Nome e CPF são obrigatórios.' }
    }

    // 1. Salvar no Supabase
    const { error: dbError } = await supabaseAdmin
      .from('confirmacoes')
      .insert([
        {
          nome,
          cpf,
          comparecera,
          mensagem,
        },
      ])

    if (dbError) {
      console.error('Erro no Supabase:', dbError)
      return { success: false, error: 'Erro ao salvar no banco de dados.' }
    }

    // 2. Notificar via Telegram
    const token = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (token && chatId) {
      const escapeMarkdown = (text: string) => text.replace(/([_*\[`])/g, '\\$1')
      const status = comparecera ? '✅ Confirmado' : '❌ Não poderá ir'
      const nomeSafe = escapeMarkdown(nome)
      const mensagemSafe = escapeMarkdown(mensagem || 'Sem mensagem')
      
      const text = `*Nova Confirmação de Presença!* \n\n*Nome:* ${nomeSafe}\n*CPF:* ${cpf}\n*Status:* ${status}\n*Mensagem:* ${mensagemSafe}`

      try {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: 'Markdown',
          }),
        })
      } catch (tgError) {
        console.error('Erro ao enviar Telegram:', tgError)
        // Não barramos o sucesso se apenas o Telegram falhar
      }
    } else {
      console.warn('TELEGRAM_BOT_TOKEN ou TELEGRAM_CHAT_ID não configurados.')
    }

    return { success: true }
  } catch (error) {
    console.error('Erro geral no RSVP:', error)
    return { success: false, error: 'Ocorreu um erro inesperado.' }
  }
}
