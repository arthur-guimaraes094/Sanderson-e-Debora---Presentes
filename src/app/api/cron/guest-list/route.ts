import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const force = searchParams.get('force') === 'true';

  // Verificação de segurança (padrão Vercel Cron)
  const authHeader = request.headers.get('authorization');
  const isAuthorized = process.env.NODE_ENV !== 'production' || 
                       authHeader === `Bearer ${process.env.CRON_SECRET}`;

  if (!isAuthorized) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Definir a data alvo: 12 de Junho de 2026
  const now = new Date();
  const targetDate = new Date('2026-06-12');
  
  // Verificação de data (ano, mês e dia)
  const isTargetDay = 
    now.getFullYear() === targetDate.getUTCFullYear() &&
    now.getMonth() === targetDate.getUTCMonth() &&
    now.getDate() === targetDate.getUTCDate();

  if (!isTargetDay && !force) {
    return NextResponse.json({ 
      message: 'Ainda não é a data alvo (12/06/2026).',
      currentDate: now.toISOString().split('T')[0]
    });
  }

  try {
    // Buscar todos os convidados que confirmaram presença
    const { data: confirmados, error } = await supabaseAdmin
      .from('confirmacoes')
      .select('nome, cpf')
      .eq('comparecera', true)
      .order('nome', { ascending: true });

    if (error) throw error;

    if (!confirmados || confirmados.length === 0) {
      return NextResponse.json({ message: 'Nenhuma confirmação encontrada até o momento.' });
    }

    // Formatar a lista para o Telegram
    const listaFormatada = confirmados.map((c, i) => `${i + 1}. ${c.nome} - CPF: ${c.cpf}`).join('\n');
    const total = confirmados.length;
    
    const text = `*📋 LISTA DE CONVIDADOS CONFIRMADOS*\n` +
                 `*Data:* 12/06/2026\n` +
                 `*Total:* ${total} pessoas\n\n` +
                 `${listaFormatada}\n\n` +
                 `_Esta é a lista consolidada de presença._`;

    // Enviar para o Telegram
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return NextResponse.json({ error: 'Configurações do Telegram ausentes.' }, { status: 500 });
    }

    const tgResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown',
      }),
    });

    if (!tgResponse.ok) {
      const errorData = await tgResponse.json();
      throw new Error(`Erro Telegram: ${JSON.stringify(errorData)}`);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Lista enviada com sucesso para o Telegram.',
      count: total 
    });

  } catch (error: any) {
    console.error('Erro no Cron Job:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
