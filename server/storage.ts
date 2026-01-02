import { db } from "./db";
import { conversations, type InsertConversation } from "@shared/schema";

export interface IStorage {
  createConversation(conversation: InsertConversation): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async createConversation(conversation: InsertConversation): Promise<void> {
    await db.insert(conversations).values(conversation);
  }
}

export const storage = new DatabaseStorage();
