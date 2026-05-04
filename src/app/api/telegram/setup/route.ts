import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Pegamos a URL base da requisição (ex: https://seu-dominio.vercel.app)
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;
  const webhookUrl = `${baseUrl}/api/telegram/webhook`;

  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    return NextResponse.json({ error: 'TELEGRAM_BOT_TOKEN não configurado.' }, { status: 500 });
  }

  // Verificação simples de segurança: só permite configurar se passar uma secret na URL
  // Ex: /api/telegram/setup?secret=SUA_SENHA
  const secretParams = url.searchParams.get('secret');
  
  // Usar uma secret é importante em produção para evitar que qualquer um altere o webhook.
  // Você pode configurar a secret no seu .env.local como TELEGRAM_WEBHOOK_SECRET, 
  // ou definir uma padrão aqui se preferir.
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET || 'senha123'; 

  if (secretParams !== webhookSecret) {
    return NextResponse.json({ error: 'Não autorizado. Forneça o parâmetro secret correto na URL.' }, { status: 401 });
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook?url=${webhookUrl}`);
    const data = await response.json();

    if (data.ok) {
      return NextResponse.json({ 
        success: true, 
        message: 'Webhook configurado com sucesso!',
        webhookUrl: webhookUrl
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Falha ao configurar webhook.',
        telegramResponse: data 
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Erro ao configurar webhook:', error);
    return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 });
  }
}
