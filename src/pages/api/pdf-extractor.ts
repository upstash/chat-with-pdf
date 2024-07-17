import { NextApiRequest, NextApiResponse } from 'next'
import { ragChat } from '@/utils/rag-chat'

const pdf = require('pdf-parse')

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        const data = req.body.data
        const text = await extractTextFromPDF(data)
        ragChat.context.add({
            type: 'text',
            data: text,
        })
        res.status(200).json({
            message: 'PDF extracted successfully',
        })
    } else {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` })
    }
}

async function extractTextFromPDF(data: number[]): Promise<string> {
    // Convert the array of numbers back to a Buffer
    const buffer = Buffer.from(data)
    const pdfData = await pdf(buffer)
    let pdfText = pdfData.text
    // also add number check
    pdfText = pdfText.replace(/[^\p{L}\p{N}]/gu, ' ')
    pdfText = pdfText.replace(/\s+/g, ' ').trim()
    return pdfText
}
