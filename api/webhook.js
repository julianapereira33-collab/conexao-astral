const { Resend } = require('resend');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { nome, email, telefone, mapa_astral, data_nascimento } = req.body;

  // Forward to n8n webhook
  if (process.env.N8N_WEBHOOK_URL) {
    try {
      await fetch(process.env.N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, telefone, mapa_astral, data_nascimento })
      });
    } catch (error) {
      console.error('n8n webhook error:', error);
    }
  }

  // Send confirmation email via Resend
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'Conexao Astral <noreply@conexaoastral.com>',
        to: email,
        subject: 'Seu Mapa Astral esta a caminho!',
        html: `<h1>Ola, ${nome}!</h1><p>Recebemos seu pedido de mapa astral. Em breve entraremos em contato.</p>`
      });

      // Notify Wellington
      if (process.env.WELLINGTON_EMAIL) {
        await resend.emails.send({
          from: 'Conexao Astral <noreply@conexaoastral.com>',
          to: process.env.WELLINGTON_EMAIL,
          subject: 'Novo pedido de mapa astral',
          html: `<h2>Novo pedido recebido</h2><p>Nome: ${nome}</p><p>Email: ${email}</p><p>Telefone: ${telefone}</p><p>Mapa: ${mapa_astral}</p>`
        });
      }
    } catch (error) {
      console.error('Resend error:', error);
    }
  }

  res.status(200).json({ success: true, message: 'Dados recebidos com sucesso' });
};
