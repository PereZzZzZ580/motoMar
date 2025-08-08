import { Request, Response } from "express";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function chatSupport(req: Request, res: Response) {
  const { messages } = req.body as { messages: { role: "user"|"assistant", content: string }[] };
  if (!messages?.length) {
    return res.status(400).json({ error: "Falta el campo messages" });
  }
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
    });
    const reply = completion.data.choices[0].message;
    return res.json({ message: reply });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: "Error en OpenAI" });
  }
}
