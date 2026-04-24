'use server'

import { supabaseAdmin } from '@/lib/supabase'
import { MercadoPagoConfig, Preference } from 'mercadopago'

// Initialize Mercado Pago
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
})

export async function gerarPagamento(formData: FormData) {
  try {
    const presente_id = formData.get('presente_id') as string
    const nome = formData.get('nome') as string
    const foto = formData.get('foto') as File

    if (!presente_id || !nome || !foto) {
      return { error: 'Por favor, preencha todos os campos e anexe sua foto.' }
    }

    if (!(foto instanceof File) || foto.size === 0) {
      return { error: 'A foto é obrigatória e precisa ser um arquivo válido.' }
    }

    // 1. Validar se o presente ainda está disponível e pegar o valor real do banco
    const { data: presente, error: fetchError } = await supabaseAdmin
      .from('presentes')
      .select('id, nome, valor')
      .eq('id', presente_id)
      .single()

    if (fetchError || !presente) {
      return { error: 'Presente não encontrado.' }
    }

    // Verificar se já foi resgatado (aprovado)
    const { data: resgatesExistentes } = await supabaseAdmin
      .from('resgates')
      .select('id')
      .eq('presente_id', presente_id)

    if (resgatesExistentes && resgatesExistentes.length > 0) {
      return { error: 'Ops! Alguém foi mais rápido e acabou de resgatar este presente.' }
    }

    // 2. Upload da Foto para o Storage
    const timestamp = Date.now()
    const fotoExt = foto.name.split('.').pop()
    const fotoPath = `${timestamp}_${Math.random().toString(36).substring(7)}.${fotoExt}`

    const { error: fotoError } = await supabaseAdmin.storage
      .from('fotos_convidados')
      .upload(fotoPath, foto)

    if (fotoError) {
      console.error('Erro upload foto:', fotoError)
      return { error: 'Falha ao fazer upload da foto.' }
    }

    // 3. Criar a Preferência no Mercado Pago
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const preference = new Preference(client)

    // Construímos o external_reference com os dados que precisamos no webhook
    const metadata = JSON.stringify({
      p: presente.id,
      n: nome,
      f: fotoPath
    })

    const body = {
      items: [
        {
          id: presente.id,
          title: `Presente de Casamento: ${presente.nome}`,
          quantity: 1,
          unit_price: Number(presente.valor),
          currency_id: 'BRL',
        }
      ],
      back_urls: {
        success: `${siteUrl}/?success=true&guest=${encodeURIComponent(nome)}`,
        pending: `${siteUrl}/`,
        failure: `${siteUrl}/`,
      },
      auto_return: 'approved',
      external_reference: metadata,
      notification_url: `${siteUrl}/api/webhooks/mercadopago`,
      statement_descriptor: 'CASAMENTO'
    }

    const response = await preference.create({ body })

    // Retorna a URL de pagamento para o frontend redirecionar o usuário
    return { 
      success: true, 
      initPoint: response.init_point, 
      sandboxInitPoint: response.sandbox_init_point 
    }

  } catch (error) {
    console.error('Erro inesperado ao gerar pagamento:', error)
    return { error: 'Ocorreu um erro ao conectar com o meio de pagamento.' }
  }
}
