# PDF Chatbot with Upstash RAGChat

This project demonstrates a PDF chatbot utilizing Upstash's RAGChat and OpenAI's GPT-4 model. The chatbot extracts text from a PDF file and uses it to answer user queries.

## Features

* Uploading PDF files and extracting text.
* Chat interface for interacting with the extracted content.

## Project Structure

* api/chat/route.ts: Handles chat requests.
* components/chat.tsx: Main chat interface component.
* pages/api/pdf-extractor.ts: Extracts text from uploaded PDF files.
* utils/rag-chat.ts: Configures RAGChat with OpenAI's GPT-4 model.
  
## Getting Started

### Prerequisites

* npm or yarn to install dependencies
* Upstash and OpenAI API keys

### Installation

1. Clone the repository

```bash
git clone git@github.com:upstash/chat-with-pdf.git
cd chat-with-pdf
```

2. Install dependencies

```bash
npm install
```

3. Create a .env file in the root directory and add your Upstash and OpenAI API keys:

```makefile
OPENAI_API_KEY=your_openai_api_key
UPSTASH_VECTOR_REST_URL=your_upstash_vector_rest_url
UPSTASH_VECTOR_REST_TOKEN=your_upstash_vector_rest_token
```

4. Run the development server

```bash
npm run dev
```

## Usage

1. Open your browser and go to http://localhost:3000.
2. Upload a PDF file.
3. Start chatting with the bot using the extracted content from the PDF.