import { Request, Response } from "express";

interface Mensaje {
autor: "usuario" | "bot";
  texto: string; 
}

export async function chatSupport(req: Request, res: Response) {
    const { mensajes }: { mensajes: Mensaje[] } = req.body;
  if (!mensajes?.length) {
    return res.status(400).json({ error: "Falta el campo mensajes" });
  }

  const clave = process.env.OPENAI_API_KEY;
  if (!clave) {
    return res.status(500).json({ error: "Falta la clave de API" });
  }

  const mensajesIA = [
    { role: "system", content: "Eres un asistente de soporte para MotoMar." },
    ...mensajes.map((m) => ({
      role: m.autor === "usuario" ? "user" : "assistant",
      content: m.texto,
    })),
  ];

  try {
    const respuesta = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${clave}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: mensajesIA,
      }),
    });

    if (!respuesta.ok) {
      const textoError = await respuesta.text();
      console.error("Error de OpenAI:", textoError);
      return res.status(500).json({ error: "Error al conectar con el modelo" });
    }

    const datos = await respuesta.json();
    const contenido = datos.choices?.[0]?.message?.content || "Sin respuesta";
    return res.json({ respuesta: contenido });
  } catch (error) {
    console.error("Error en chatSupport:", error);
    return res.status(500).json({ error: "Error al procesar la solicitud" });
  }
}
