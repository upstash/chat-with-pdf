import { RAGChat, openaiModel } from '@upstash/rag-chat'

export const ragChat = new RAGChat({
    model: openaiModel('gpt-4-turbo'),
})
