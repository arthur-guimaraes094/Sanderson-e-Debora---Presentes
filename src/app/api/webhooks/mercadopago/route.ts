import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { supabaseAdmin } from '@/lib/supabase'

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
})

export async function POST(request: Request) {
  try {
    const url = new URL(request.url)
    
    // O Mercado Pago envia o ID do pagamento na querystring ou no body
    // Querystring: ?data.id=12345&type=payment
    const id = url.searchParams.get('data.id')
    const type = url.searchParams.get('type')

    let paymentId = id

    if (!paymentId) {
      // Tentar pegar do body
      const body = await request.json()
      if (body.type === 'payment' && body.data && body.data.id) {
        paymentId = body.data.id
      }
    }

    if (type !== 'payment' || !paymentId) {
      return NextResponse.json({ message: 'Not a payment event' }, { status: 200 })
    }

    // Buscar os dados atualizados do pagamento no Mercado Pago
    const paymentApi = new Payment(client)
    const paymentData = await paymentApi.get({ id: paymentId })

    if (paymentData.status === 'approved') {
      // Pagamento aprovado! Vamos registrar no banco
      const externalRef = paymentData.external_reference

      if (!externalRef) {
        console.error('Pagamento aprovado, mas sem external_reference:', paymentId)
        return NextResponse.json({ message: 'Missing external_reference' }, { status: 200 })
      }

      // Decodificar o metadata que enviamos ao criar a preferência
      // { p: presente_id, n: nome, f: fotoPath }
      let metadata;
      try {
        metadata = JSON.parse(externalRef)
      } catch (e) {
        console.error('Falha ao dar parse no external_reference:', externalRef)
        return NextResponse.json({ message: 'Invalid external_reference' }, { status: 200 })
      }

      const presente_id = metadata.p
      const nome_convidado = metadata.n
      const fotoPath = metadata.f

      // Obter URL pública da foto
      const { data: { publicUrl: foto_convidado_url } } = supabaseAdmin.storage
        .from('fotos_convidados')
        .getPublicUrl(fotoPath)

      // Verificar se o resgate já foi processado (para evitar duplicidade no webhook)
      const { data: existente } = await supabaseAdmin
        .from('resgates')
        .select('id')
        .eq('comprovante_url', `mp_${paymentId}`)
        .single()

      if (!existente) {
        // Inserir no banco
        const { error: insertError } = await supabaseAdmin
          .from('resgates')
          .insert({
            presente_id,
            nome_convidado,
            foto_convidado_url,
            comprovante_url: `mp_${paymentId}`, // Usamos o ID do pagamento para identificar
          })

        if (insertError) {
          console.error('Erro ao registrar resgate do Mercado Pago:', insertError)
          // Em caso de falha no banco, MP tentará novamente o webhook
          return NextResponse.json({ error: 'Database error' }, { status: 500 })
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('Erro no Webhook do Mercado Pago:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
