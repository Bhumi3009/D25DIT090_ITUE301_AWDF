import { useState, useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const GITHUB_USERNAME = "https://github.com/Bhumi3009"; 

function Projects() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const fetchRepos = () => {
    setLoading(true);
    setError(null);

    fetch(`https://api.github.com/users/Bhumi3009/repos`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setRepos(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchRepos} />;

  return (
    <div className="page">
      <input
        type="text"
        placeholder="Search repositories..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="projects-search"
      />

      <div className="bento-grid">
        {filteredRepos.map((repo, index) => (
          <div key={repo.id} className="bento-card span-3">
            <p className="card-number">{String(index + 1).padStart(2, "0")}</p>
            <h2 className="card-title">
              <a href={repo.html_url} target="_blank" rel="noreferrer">
                {repo.name}
              </a>
            </h2>
            <p className="project-points">
              {repo.description || "No description provided."}
            </p>
            <div className="card-tech">
              <span className="tech-tag">⭐ {repo.stargazers_count}</span>
              {repo.language && (
                <span className="tech-tag">{repo.language}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;