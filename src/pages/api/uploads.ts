import { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

// Disable body parsing for file uploads
export const config = {
    api: {
        bodyParser: false,
    },
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method not allowed' })
        }
        const uploadDir = path.join(process.cwd(), '/uploads')
        fs.mkdirSync(uploadDir, { recursive: true })
        const form = formidable({
            uploadDir: uploadDir, // Set the upload directory
            keepExtensions: true, // Keep the file extension
            multiples: false, // For single file upload
            filename: (name, ext, part) => {
                const originalFilename = part.originalFilename as string
                return originalFilename
            },
        })

        const parsedData = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) {
                    reject(err)
                } else {
                    resolve({ fields, files })
                }
            })
        })

        const file = (parsedData as any).files.file
        console.log('File :', file)
        const filePath = file[0].originalFilename
        console.log('File uploaded:', filePath)
        return res.status(200).json({ filePath })
    } catch (error) {
        console.error('Error while uploading file:', error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}
