export default function Projects() {
  const projects = [
    {
      title: "Portfolio & Component Architecture",
      practical: "Practical 1",
      description: "Static single-page layout composed of reusable functional components with props."
    },
    {
      title: "React Routing & State Management",
      practical: "Practical 2",
      description: "Multi-page navigation with React Router v6, controlled inputs, and theme toggle."
    },
    {
      title: "Full-Stack Task CRUD with MongoDB",
      practical: "Practical 6",
      description: "End-to-end integration of React UI with Express and Mongoose REST backend."
    },
    {
      title: "JWT Authentication & Middleware Pipeline",
      practical: "Practical 7",
      description: "Secure user registration, bcrypt hashing, token verification, and input validation."
    }
  ];

  return (
    <div className="page">
      <div className="bento-card span-3">
        <h2 className="card-title">Completed Lab Projects</h2>
        <p className="hero-subtitle">Advanced Web Development Frameworks (ITUE301)</p>
      </div>

      <div className="projects-grid">
        {projects.map((proj, idx) => (
          <div key={idx} className="bento-card project-card">
            <span className="badge-pill">{proj.practical}</span>
            <h3 className="card-title" style={{ marginTop: '10px' }}>{proj.title}</h3>
            <p className="project-points">{proj.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
