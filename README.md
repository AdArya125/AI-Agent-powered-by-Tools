# 🤖 LLMs Based AI Agent

An intelligent web-based AI assistant powered by Claude 3.5 Haiku and orchestrated with LangChain, LangGraph, and IBM Watsonx Flows. This agent dynamically invokes external tools like Wikipedia, YouTube Transcript, Currency Conversion, and REST/GraphQL APIs to provide real-time, context-aware responses.


---


## 🛠️ Tech Stack

- **Frontend**: Next.js, Tailwind CSS, Shadcn
- **Backend**: Convex (serverless DB), Clerk (authentication)
- **LLM Engine**: Claude 3.5 Haiku (20241022)
- **Tool Orchestration**: LangChain, LangGraph, IBM Watsonx Flows
- **Integrated Tools**:
  - Wikipedia
  - YouTube Transcript Retriever
  - Google Books
  - Currency Exchange
  - Math Engine
  - Dummy REST APIs (products, customers, comments)



---



## 📸 Features

- 🔍 Intelligent Tool Selection using Claude 3.5 + LangGraph  
- 💬 Chat-based user interface  
- 🔐 Secure authentication with Clerk  
- 🌐 Real-time API integration (REST & GraphQL)  
- 💾 Serverless database using Convex  
- 🧩 Modular and scalable architecture  



---



## 🚀 Getting Started

### ✅ Prerequisites

Make sure you have:

- Node.js ≥ 18.x
- npm or yarn
- Git
- IBM Watson xFlows Engine
- Convex CLI (`npm install -g convex`)
- A Clerk project (for authentication)
- API keys for YouTube, currency exchange, etc.

---

### 📦 Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/AdArya125/AI-Agent-powered-by-Tools
   cd AI-Agent-powered-by-Tools
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Environment Variables**

   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY= your_clerk_publishable_key
   CLERK_SECRET_KEY= your_clerk_secret_key
   
   # Deployment used by `npx convex dev`
   # From your Convex Project Dashboard
   CONVEX_DEPLOYMENT= your_convex_username
   NEXT_PUBLIC_CONVEX_URL= your_public_convex_url

   ANTHROPIC_API_KEY= your_anthropic_API_key

   # wxflows whoami --apikey
   # update this after adding and deplowing the tools to wxflows
   WXFLOWS_APIKEY= your_wxflows_API_key
   WXFLOWS_ENDPOINT= your_wxflows_endpoint
  
   ```

4. **Set up Convex**
   ```bash
   npx convex dev
   ```

5. **Run the Development Server**
   ```bash
   npm run dev
   ```

---

## 🧪 Usage

- Visit [http://localhost:3000](http://localhost:3000)
- Register/login using Clerk
- Ask queries like:
  - “Get the transcript of this YouTube video: [URL]”
  - “What’s the exchange rate between USD and EUR?”
  - “Tell me about the history of AI.”

The AI agent will:
- Parse the query using Claude
- Choose and invoke the appropriate tool
- Return a polished, context-aware response

---

## 🔐 Authentication

- Powered by [Clerk](https://clerk.dev)
- Supports secure sign-up/login
- Session and role-based management built-in

---

## 🧩 Tool Integration Architecture

- LangChain wraps each tool as a callable component
- LangGraph manages stateful tool workflows
- IBM Watsonx Flows enables complex automations

---

## 🧠 Future Scope

- Add custom ML models as new tools  
- Integrate secure private RAG pipelines  
- Enable biometric login & deeper GDPR compliance  
- Auto-scale via cloud deployment (Vercel/AWS/etc.)  



---



## 🙌 Acknowledgments

- Claude by Anthropic  
- LangChain, LangGraph, Clerk, Convex  
- IBM Watsonx Flows


---



## 📬 Contact

**Aditya Arya**  
Email: adarya125@gmail.com  
GitHub: [@AdArya125](https://github.com/AdArya125)

