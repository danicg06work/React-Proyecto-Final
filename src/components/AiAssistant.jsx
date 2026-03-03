import { useState } from 'react'
import { askAiAssistantService } from '../services/AiAssistantService'
import './AiAssistant.css'

const AiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hola, soy tu asistente de videojuegos. Puedo buscar y recomendar juegos de la base de datos actual.'
    }
  ])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!input.trim() || loading) return

    const nextUserMessage = { role: 'user', content: input.trim() }
    const nextHistory = [...messages, nextUserMessage]

    setMessages(nextHistory)
    setInput('')
    setLoading(true)

    try {
      const answer = await askAiAssistantService(nextUserMessage.content, nextHistory)
      setMessages((prev) => [...prev, { role: 'assistant', content: answer }])
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', content: error.message }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button className="ai-fab" onClick={() => setIsOpen((prev) => !prev)} aria-label="Abrir asistente IA">
        IA
      </button>

      {isOpen ? (
        <section className="ai-panel" aria-label="Asistente IA de videojuegos">
          <header className="ai-panel-header">
            <h3>Asistente IA</h3>
            <button onClick={() => setIsOpen(false)} aria-label="Cerrar asistente">✕</button>
          </header>

          <div className="ai-messages">
            {messages.map((message, index) => (
              <article key={`${message.role}-${index}`} className={`ai-message ai-message-${message.role}`}>
                <p>{message.content}</p>
              </article>
            ))}
            {loading ? <p className="text-muted">Pensando...</p> : null}
          </div>

          <form className="ai-form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Pregunta por videojuegos de la base de datos"
            />
            <button type="submit" disabled={loading || !input.trim()}>Enviar</button>
          </form>
        </section>
      ) : null}
    </>
  )
}

export default AiAssistant
