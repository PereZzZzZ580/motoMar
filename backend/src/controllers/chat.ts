import { Request, Response } from "express";
import axios from "axios";

interface Mensaje {
  autor: "usuario" | "bot";
  texto: string;
}

interface RespuestaOpenAI {
  choices?: {
    message?: {
      content?: string;
    };
  }[];
}

interface RespuestaErrorOpenAI {
  error?: {
    message?: string;
  };
}

interface ErrorAxios<T = any> {
  response?: {
    status?: number;
    data?: T;
  };
  message?: string;
}

const intervaloRitmoMs = Number(process.env.RITMO_PETICIONES_MS) || 1000;
let proximaPeticionPermitida = 0;

async function esperarRitmo() {
  const ahora = Date.now();
  if (ahora < proximaPeticionPermitida) {
    await new Promise((resuelve) =>
      setTimeout(resuelve, proximaPeticionPermitida - ahora)
    );
  }
  proximaPeticionPermitida = Date.now() + intervaloRitmoMs;
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
    await esperarRitmo();
    const respuestaOpenAI = await axios.post<RespuestaOpenAI>(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
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
    } catch (error) {
    const errorAxios = error as ErrorAxios<RespuestaErrorOpenAI>;
    const estado = errorAxios.response?.status ?? 500;
    const mensaje =
      errorAxios.response?.data?.error?.message ||
      errorAxios.message ||
      "Error al procesar la solicitud";
    console.error(
      "Error en chatSupport:",
      errorAxios.response?.data || errorAxios
    );
    return res.status(estado).json({ error: mensaje });
  }
}
