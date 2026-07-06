import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !token) {
    return NextResponse.json({ ok: false, message: 'Faltan credenciales de WhatsApp Cloud API' }, { status: 400 });
  }

  const payload = {
    messaging_product: 'whatsapp',
    to: body?.to,
    type: 'text',
    text: { body: body?.message ?? 'Notificación automática del spa.' }
  };

  const response = await fetch(`https://graph.facebook.com/v22.0/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  return NextResponse.json({ ok: response.ok, data }, { status: response.ok ? 200 : 500 });
}
