const { Resend } = require('resend');

module.exports = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
          return res.status(200).end();
    }

    if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method not allowed' });
    }

    const {
          nome,
          email,
          telefone,
          data_nascimento,
          cidade_nascimento,
          hora_nascimento,
          hora_conhecimento
    } = req.body;

    // Validate required fields
    if (!nome || !email) {
          return res.status(400).json({ error: 'Nome e e-mail são obrigatórios' });
    }

    const payload = {
          nome,
          email,
          telefone: telefone || 'Não informado',
          data_nascimento: data_nascimento || 'Não informado',
          cidade_nascimento: cidade_nascimento || 'Não informado',
          hora_nascimento: hora_nascimento || 'Não informado',
          hora_conhecimento: hora_conhecimento || 'Não informado',
          timestamp: new Date().toISOString()
    };

    // Forward to n8n webhook
    if (process.env.N8N_WEBHOOK_URL) {
          try {
                  await fetch(process.env.N8N_WEBHOOK_URL, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                  });
          } catch (error) {
                  console.error('n8n webhook error:', error);
          }
    }

    // Send emails via Resend
    if (process.env.RESEND_API_KEY) {
          try {
                  const resend = new Resend(process.env.RESEND_API_KEY);

            // Confirmation email to CLIENT
            await resend.emails.send({
                      from: 'Conexão Astral <noreply@conexaoastral.com.br>',
                      to: email,
                      subject: '✨ Seus dados foram recebidos — Mapa em geração!',
                      html: `
                      <!DOCTYPE html>
                      <html lang="pt-BR">
                      <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
                      <style>
                        body{margin:0;padding:0;background:#0D0720;font-family:'Segoe UI',Arial,sans-serif;color:#E8D5FF}
                          .wrap{max-width:580px;margin:0 auto;padding:32px 20px}
                            .header{background:linear-gradient(135deg,#5B21B6,#7C3AED);border-radius:16px 16px 0 0;padding:32px 28px;text-align:center}
                              .header h1{color:#fff;font-size:24px;margin:0 0 8px;font-weight:700}
                                .header p{color:#D8B4FE;font-size:14px;margin:0}
                                  .body{background:#140830;border:1px solid #2E1858;border-radius:0 0 16px 16px;padding:28px}
                                    .greeting{font-size:18px;font-weight:700;color:#fff;margin-bottom:12px}
                                      .text{font-size:14px;line-height:1.7;color:#C4B5D8;margin-bottom:20px}
                                        .data-box{background:#0D0720;border:1px solid #3B2070;border-radius:12px;padding:18px;margin-bottom:20px}
                                          .data-row{display:flex;gap:10px;padding:8px 0;border-bottom:1px solid #1B0E3D;font-size:13px}
                                            .data-row:last-child{border:none}
                                              .data-label{color:#C084FC;font-weight:600;min-width:120px}
                                                .data-value{color:#E8D5FF}
                                                  .steps{background:#1B0E3D;border-radius:12px;padding:18px;margin-bottom:20px}
                                                    .step{display:flex;gap:12px;margin-bottom:14px;align-items:flex-start}
                                                      .step:last-child{margin:0}
                                                        .step-num{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#A855F7,#7C3AED);color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
                                                          .step-txt{font-size:13px;color:#C4B5D8;line-height:1.5}
                                                            .step-txt strong{color:#fff;display:block}
                                                              .footer{text-align:center;font-size:12px;color:#6B5A80;margin-top:24px}
                                                              </style>
                                                              </head>
                                                              <body>
                                                              <div class="wrap">
                                                                <div class="header">
                                                                    <div style="font-size:32px;margin-bottom:8px">🔮</div>
                                                                        <h1>Mapa em geração, ${nome}!</h1>
                                                                            <p>Seus dados foram recebidos com sucesso</p>
                                                                              </div>
                                                                                <div class="body">
                                                                                    <div class="greeting">Olá, ${nome}! ✨</div>
                                                                                        <p class="text">Recebemos todos os seus dados e já estamos gerando seu <strong>Mapa Astral + Mapa Numerológico</strong> completo e personalizado. Em breve você receberá sua análise neste mesmo e-mail.</p>
                                                                                            <div class="data-box">
                                                                                                  <div class="data-row"><span class="data-label">📅 Data:</span><span class="data-value">${data_nascimento || 'Não informado'}</span></div>
                                                                                                        <div class="data-row"><span class="data-label">🌍 Cidade:</span><span class="data-value">${cidade_nascimento || 'Não informado'}</span></div>
                                                                                                              <div class="data-row"><span class="data-label">⏰ Horário:</span><span class="data-value">${hora_nascimento || 'Não informado'} (${hora_conhecimento || ''})</span></div>
                                                                                                                  </div>
                                                                                                                      <div class="steps">
                                                                                                                            <div class="step"><div class="step-num">✓</div><div class="step-txt"><strong>Dados recebidos</strong>Confirmamos o recebimento das suas informações</div></div>
                                                                                                                                  <div class="step"><div class="step-num">2</div><div class="step-txt"><strong>Mapa em geração</strong>Nossa IA está calculando seu mapa astral e numerológico</div></div>
                                                                                                                                        <div class="step"><div class="step-num">3</div><div class="step-txt"><strong>Entrega em até 10 minutos</strong>Você receberá seu PDF personalizado neste e-mail</div></div>
                                                                                                                                            </div>
                                                                                                                                                <p class="text" style="font-size:13px">⚠️ Verifique sua caixa de spam caso não receba em 15 minutos. Em caso de dúvidas, entre em contato conosco.</p>
                                                                                                                                                  </div>
                                                                                                                                                    <div class="footer">© 2025 Conexão Astral — Todos os direitos reservados</div>
                                                                                                                                                    </div>
                                                                                                                                                    </body>
                                                                                                                                                    </html>`
            });

            // Notification email to WELLINGTON
            if (process.env.WELLINGTON_EMAIL) {
                      await resend.emails.send({
                                  from: 'Conexão Astral <noreply@conexaoastral.com.br>',
                                  to: process.env.WELLINGTON_EMAIL,
                                  subject: `🔮 Novo pedido de mapa — ${nome}`,
                                  html: `
                                  <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:20px;background:#0D0720;color:#E8D5FF;border-radius:12px">
                                    <h2 style="color:#C084FC;margin-bottom:16px">🔮 Novo Pedido de Mapa Astral</h2>
                                      <table style="width:100%;border-collapse:collapse">
                                          <tr><td style="padding:10px;border-bottom:1px solid #2E1858;color:#A855F7;font-weight:600;width:140px">Nome</td><td style="padding:10px;border-bottom:1px solid #2E1858">${nome}</td></tr>
                                              <tr><td style="padding:10px;border-bottom:1px solid #2E1858;color:#A855F7;font-weight:600">E-mail</td><td style="padding:10px;border-bottom:1px solid #2E1858">${email}</td></tr>
                                                  <tr><td style="padding:10px;border-bottom:1px solid #2E1858;color:#A855F7;font-weight:600">WhatsApp</td><td style="padding:10px;border-bottom:1px solid #2E1858">${telefone || 'Não informado'}</td></tr>
                                                      <tr><td style="padding:10px;border-bottom:1px solid #2E1858;color:#A855F7;font-weight:600">Data nasc.</td><td style="padding:10px;border-bottom:1px solid #2E1858">${data_nascimento || 'Não informado'}</td></tr>
                                                          <tr><td style="padding:10px;border-bottom:1px solid #2E1858;color:#A855F7;font-weight:600">Cidade nasc.</td><td style="padding:10px;border-bottom:1px solid #2E1858">${cidade_nascimento || 'Não informado'}</td></tr>
                                                              <tr><td style="padding:10px;border-bottom:1px solid #2E1858;color:#A855F7;font-weight:600">Hora nasc.</td><td style="padding:10px;border-bottom:1px solid #2E1858">${hora_nascimento || 'Não informado'} (${hora_conhecimento || ''})</td></tr>
                                                                  <tr><td style="padding:10px;color:#A855F7;font-weight:600">Timestamp</td><td style="padding:10px">${new Date().toLocaleString('pt-BR')}</td></tr>
                                                                    </table>
                                                                    </div>`
                      });
            }
          } catch (error) {
                  console.error('Resend error:', error);
          }
    }

    res.status(200).json({ success: true, message: 'Dados recebidos com sucesso' });
};
