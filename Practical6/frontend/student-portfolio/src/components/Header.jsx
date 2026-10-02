function Header({ name, tagline }) {
  return (
    <header className="hero">
      <p className="hero-eyebrow">{name} &mdash; Portfolio</p>
      <h1 className="hero-title">Hi, I'm {name}. {tagline}</h1>
      <p className="hero-subtitle">
        Information Technology student building full-stack web applications
        with React, Node.js, and MongoDB.
      </p>
    </header>
  )
}

export default Header