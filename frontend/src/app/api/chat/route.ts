import { NextResponse } from 'next/server';

interface Mensaje {
    autor: 'usuario' | 'bot';
    texto: string;
}

export async function POST(req: Request) {
  try {
    const { mensajes }: { mensajes: Mensaje[] } = await req.json();
    const clave = process.env.OPENAI_API_KEY;
    if (!clave) {
      return NextResponse.json({ error: 'Falta la clave de API' }, { status: 500 });
    }

    const mensajesIA = [
      { role: 'system', content: 'Eres un asistente de soporte para MotoMar.' },
      ...mensajes.map((m) => ({
        role: m.autor === 'usuario' ? 'user' : 'assistant',
        content: m.texto,
      })),
    ];

    const respuesta = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${clave}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: mensajesIA,
      }),
    });

    if (!respuesta.ok) {
      const textoError = await respuesta.text();
      console.error('Error de OpenAI:', textoError);
      return NextResponse.json({ error: 'Error al conectar con el modelo' }, { status: 500 });
    }

    const datos = await respuesta.json();
    const contenido = datos.choices?.[0]?.message?.content || 'Sin respuesta';
    return NextResponse.json({ respuesta: contenido });
  } catch (error) {
    console.error('Error en API /api/chat:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}