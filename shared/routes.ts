import { z } from 'zod';
import { insertConversationSchema, conversations } from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

export const api = {
  conversations: {
    list: {
      method: 'GET' as const,
      path: '/api/conversations',
      responses: {
        200: z.array(z.custom<typeof conversations.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/conversations',
      input: insertConversationSchema,
      responses: {
        201: z.custom<typeof conversations.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
