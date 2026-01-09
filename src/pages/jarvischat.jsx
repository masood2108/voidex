import { useState } from "react"
import { Bot, Mic, Send } from "lucide-react"

function AI() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([])

  const sendMessage = () => {
    if (!input.trim()) return

    setMessages(m => [...m, { from: "user", text: input }])
    setInput("")

    // TEMP AI RESPONSE
    setTimeout(() => {
      setMessages(m => [
        ...m,
        {
          from: "jarvis",
          text: "I'm still learning 🤖. Soon I’ll manage everything for you."
        }
      ])
    }, 600)
  }

  return (
    <div className="bg-[#0b0f14] min-h-screen flex flex-col">

      {/* HEADER */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/5">
        <div className="h-10 w-10 rounded-xl bg-brandGreen/20 flex items-center justify-center">
          <Bot className="text-brandGreen" />
        </div>

        <div>
          <h1 className="text-lg font-semibold text-white">
            JARVIS ✨
          </h1>
          <p className="text-xs text-muted">
            Your AI Assistant
          </p>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 px-6 py-10 flex justify-center">
        <div className="w-full max-w-2xl">

          {/* INTRO CARD */}
          {messages.length === 0 && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-white">
              <p className="leading-relaxed">
                Hello! I'm <span className="text-brandGreen">JARVIS</span>, your AI
                assistant for VOIDEX. I can help you manage clients, track
                payments, schedule meetings, and more.
              </p>

              <ul className="mt-4 space-y-2 text-sm text-muted">
                <li>• "Add a client named John"</li>
                <li>• "Show my pending payments"</li>
                <li>• "What's my progress this week?"</li>
                <li>• "Open the calendar"</li>
              </ul>

              <p className="mt-5 text-sm text-muted">
                How can I help you today?
              </p>
            </div>
          )}

          {/* MESSAGES */}
          <div className="space-y-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-xl text-sm
                    ${
                      m.from === "user"
                        ? "bg-brandGreen text-black"
                        : "bg-white/5 text-white"
                    }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* INPUT BAR */}
      <div className="border-t border-white/5 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">

          <button className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10">
            <Mic size={18} className="text-muted" />
          </button>

          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Ask JARVIS anything..."
            className="flex-1 bg-white/5 border border-white/10
                       rounded-xl px-4 py-2 text-sm text-white
                       outline-none focus:border-brandGreen"
          />

          <button
            onClick={sendMessage}
            className="h-10 w-10 rounded-xl bg-brandGreen
                       flex items-center justify-center"
          >
            <Send size={16} className="text-black" />
          </button>

        </div>

        <p className="text-xs text-muted text-center mt-3">
          AI can help manage clients, payments, and more
        </p>
      </div>
    </div>
  )
}

export default AI
