import { NextApiRequest, NextApiResponse } from 'next'
import { ragChat } from '@/utils/rag-chat'
import path from 'path'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        if (!req.body.data) {
            res.status(400).json({ error: 'Missing data' })
            return
        }
        await ragChat.context.deleteEntireContext()

        const fileSource = req.body.data
        await ragChat.context.add({
            type: 'pdf',
            fileSource: path.join(process.cwd(), '/uploads/', fileSource),
        })
        res.status(200).json({
            message: 'PDF extracted successfully',
        })
    } else {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` })
    }
}
