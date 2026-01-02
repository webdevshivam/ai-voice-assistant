import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertConversation } from "@shared/routes";

export function useConversations() {
  return useQuery({
    queryKey: [api.conversations.list.path],
    queryFn: async () => {
      const res = await fetch(api.conversations.list.path);
      if (!res.ok) throw new Error("Failed to fetch conversations");
      return api.conversations.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertConversation) => {
      const res = await fetch(api.conversations.create.path, {
        method: api.conversations.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.conversations.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create conversation log");
      }
      
      return api.conversations.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.conversations.list.path] });
    },
  });
}
