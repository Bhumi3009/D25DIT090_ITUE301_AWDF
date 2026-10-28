import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="page">
      <div className="bento-card span-3 contact-card">
        <h2 className="card-title">Contact & Student Details</h2>
        <div style={{ marginBottom: '20px', color: '#94a3b8', lineHeight: 1.6 }}>
          <p><strong>Student ID / Roll No:</strong> D25DIT090</p>
          <p><strong>Course:</strong> Advanced Web Development Frameworks (ITUE301)</p>
          <p><strong>Department:</strong> DEPSTAR - Information Technology, CHARUSAT</p>
        </div>

        {submitted ? (
          <div className="alert alert-success">
            Thank you for reaching out! Message received.
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <label>
              Your Name
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </label>
            <label>
              Email Address
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </label>
            <label>
              Message
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />
            </label>
            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
