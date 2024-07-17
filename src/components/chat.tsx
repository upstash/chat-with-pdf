'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useChat } from 'ai/react'
import '@/app/globals.css'

export function ChatComponent() {
    const { messages, input, handleInputChange, handleSubmit, setMessages } =
        useChat({
            api: '/api/chat',
        })

    const [fileUrl, setFileUrl] = useState<string>('')
    const [isFileUploaded, setIsFileUploaded] = useState<boolean>(false)
    const [msg, setMsg] = useState<string>('')

    async function handleUpload() {
        if (fileUrl && !isFileUploaded) {
            setMsg('Uploading...')
            
            // Fetch the file and extract the text
            const responseToBlob = await fetch(fileUrl)
            const blob = await responseToBlob.blob()
            const arrayBuffer = await new Response(blob).arrayBuffer()
            const uint8Array = new Uint8Array(arrayBuffer)

            const response = await fetch('/api/pdf-extractor', {
                method: 'POST',
                body: JSON.stringify({ data: Array.from(uint8Array) }),
                headers: {
                    'Content-Type': 'application/json',
                    'req-type': 'fileUpload',
                },
            })

            if (response.ok) {
                setIsFileUploaded(true)
                setMsg('File uploaded successfully')
                setMessages([
                    {
                        id: '-1',
                        role: 'system',
                        content: 'Hi, how can I help you today?',
                    },
                ])
            } else {
                setMsg('Error while uploading file')
                console.log('Error:', response.status)
            }
        } else {
            console.log('No file selected')
        }
    }

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = event.target.files

        if (files && files.length > 0) {
            const selectedPdf = files[0]
            setFileUrl(URL.createObjectURL(selectedPdf))
        }
    }

    const handleKeyPress = (
        event: React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            handleSubmit(event as any)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="grid w-full max-w-3xl px-4 gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <TextIcon className="w-8 h-8" />
                        <h1 className="text-2xl font-bold tracking-tighter">
                            PDF Chat
                        </h1>
                    </div>
                </div>
                <div className="grid gap-4">
                    <div className="grid gap-1.5">
                        <Label className="leading-none" htmlFor="upload">
                            Select a PDF to upload
                        </Label>
                        <div className="flex items-center gap-4">
                            <Input
                                accept=".pdf"
                                id="upload"
                                type="file"
                                onChange={handleFileChange}
                                className="max"
                            />
                            <Button
                                className="upload-button"
                                disabled={!fileUrl}
                                type="button"
                                onClick={handleUpload}
                            >
                                Upload
                            </Button>
                        </div>
                        {msg && <span>{msg}</span>}
                    </div>
                </div>

                <div className="grid gap-4">
                    <div className="grid gap-1.5">
                        <Label className="leading-none" htmlFor="conversation">
                            Conversation
                        </Label>
                        <div className="border p-4 rounded-lg h-48 overflow-y-auto">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`chat-bubble ${message.role === 'user' ? 'user-message' : 'system-message'}`}
                                >
                                    <div className="chat-content">
                                        <p className="message">
                                            {message.content}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="grid gap-1.5">
                        <Textarea
                            id="message"
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message"
                            value={input}
                            disabled={!isFileUploaded}
                        />
                    </div>
                    <div className="flex justify-center">
                        <form onSubmit={handleSubmit}>
                            <Button type="submit" disabled={!isFileUploaded}>
                                Send
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

function TextIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M17 6.1H3" />
            <path d="M21 12.1H3" />
            <path d="M15.1 18H3" />
        </svg>
    )
}
