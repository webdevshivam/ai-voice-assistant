import type { Express } from "express";
import { type Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { storage } from "./storage";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini client using Replit AI Integrations pattern
const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
  },
});

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  const io = new SocketIOServer(httpServer, {
    path: "/ws",
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    socket.on("message", async (data: { text: string; systemPrompt: string }) => {
      try {
        console.log("Received message from socket:", socket.id, data.text);
        
        // Default prompt if empty
        const systemContent = data.systemPrompt || "You are a helpful Hindi AI assistant. Answer in Hindi.";

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          systemInstruction: systemContent + " Use casual, conversational Hindi (Hinglish if natural). Avoid formal phrases like 'Main Google dwara train kiya gaya ek bada bhasha model hu'. Be friendly and talk like a real person.",
          contents: [{ role: "user", parts: [{ text: data.text }] }],
        });

        const aiText = response.text || "माफ़ कीजिये, मैं समझ नहीं पाया।";

        // Save to DB asynchronously
        storage.createConversation({
          userMessage: data.text,
          aiResponse: aiText,
          systemPrompt: systemContent,
        }).catch(err => console.error("DB Error:", err));

        socket.emit("response", { text: aiText });

      } catch (error) {
        console.error("Gemini Error:", error);
        socket.emit("response", { text: "तकनीकी खराबी के कारण मैं जवाब नहीं दे पा रहा हूँ।" });
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
    });
  });

  return httpServer;
}
