import { Request, Response } from "express";
import axios from "axios";

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
    const respuestaOpenAI = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: mensajesIA,
  },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${clave}`,
        },
      }
    );
    const contenido =
      respuestaOpenAI.data.choices?.[0]?.message?.content || "Sin respuesta";
    return res.json({ respuesta: contenido });
    } catch (error: any) {
    console.error("Error en chatSupport:", error.response?.data || error);
    return res
      .status(500)
      .json({ error: "Error al procesar la solicitud" });
  }
}
