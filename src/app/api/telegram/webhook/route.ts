import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Verifica se é uma mensagem de texto
    if (body.message && body.message.text) {
      const text = body.message.text.trim();
      const chatId = body.message.chat.id;

      // Verifica se o comando é /lista
      if (text.startsWith('/lista')) {
        
        // 1. Buscar confirmados no banco de dados
        const { data: confirmados, error } = await supabaseAdmin
          .from('confirmacoes')
          .select('nome, cpf')
          .eq('comparecera', true)
          .order('nome', { ascending: true });

        if (error) {
          throw error;
        }

        let respostaTexto = '';

        if (!confirmados || confirmados.length === 0) {
          respostaTexto = 'Ainda não há convidados confirmados.';
        } else {
          const total = confirmados.length;
          const listaFormatada = confirmados
            .map((c, i) => `${i + 1}. ${c.nome} - CPF: ${c.cpf}`)
            .join('\n');

          respostaTexto = `*📋 LISTA DE CONVIDADOS CONFIRMADOS*\n` +
                          `*Total:* ${total} pessoas\n\n` +
                          `${listaFormatada}\n\n` +
                          `_Solicitado via comando /lista_`;
        }

        // 2. Enviar resposta para o Telegram
        const token = process.env.TELEGRAM_BOT_TOKEN;
        
        if (token) {
          await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: respostaTexto,
              parse_mode: 'Markdown',
            }),
          });
        } else {
          console.error('TELEGRAM_BOT_TOKEN não encontrado.');
        }
      }
    }

    // O Telegram exige que sempre retornemos 200 OK, senão ele fica reenviando a mensagem
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Erro no webhook do Telegram:', error);
    // Mesmo em caso de erro interno, retornamos 200 para o Telegram parar de enviar,
    // ou deixamos falhar se quisermos que ele tente novamente (mas 200 é mais seguro)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 200 });
  }
}
