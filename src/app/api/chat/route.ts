import { aiUseChatAdapter } from '@upstash/rag-chat/nextjs'
import { ragChat } from '@/utils/rag-chat'

export async function POST(req: Request) {
    try {
        console.log('Request received')
        const { messages } = await req.json()
        const lastMessage = messages[messages.length - 1].content
        const response = await ragChat.chat(lastMessage, { streaming: true })
        return aiUseChatAdapter(response)
    } catch (error) {
        console.error('OpeanAI API error :', error)
        return new Response('OpeanAI API error', { status: 500 })
    }
}
