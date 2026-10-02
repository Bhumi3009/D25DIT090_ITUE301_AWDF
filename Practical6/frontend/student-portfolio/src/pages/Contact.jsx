import { useState } from 'react'

function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const maxLength = 250

  const handleSubmit = (e) => {
    e.preventDefault()
    alert(`Thanks ${name || 'there'}! Your message has been noted.`)
  }

  return (
    <div className="page">
      <div className="bento-card span-3 contact-card">
        <h2 className="card-title">Contact Me</h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </label>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </label>
          <label>
            Message
            <textarea
              value={message}
              maxLength={maxLength}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message..."
              rows={5}
            />
          </label>
          <p className="char-count">{message.length} / {maxLength} characters</p>
          {message.length > 0 && (
            <div className="live-preview"><strong>Live preview:</strong> {message}</div>
          )}
          <button type="submit" className="btn btn-secondary">Send Message</button>
        </form>
      </div>
    </div>
  )
}

export default Contact