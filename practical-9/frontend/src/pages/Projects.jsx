import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";

function Projects() {
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

    // Function to fetch repositories
    const fetchRepos = () => {
        setLoading(true);
        setError(null);

        fetch("https://api.github.com/users/Meera-Turakhiya/repos")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Unable to fetch repositories.");
                }
                return response.json();
            })
            .then((data) => {
                setRepos(data);
            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchRepos();
    }, []);

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return (
            <div className="projects">
                <ErrorMessage message={error} />

                <button onClick={fetchRepos}>
                    Retry
                </button>
            </div>
        );
    }

    const filteredRepos = repos.filter((repo) =>
        repo.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <section className="projects">
            <h1>My GitHub Repositories</h1>

            <input
                type="text"
                placeholder="Search Repository..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="project-list">
                {filteredRepos.map((repo) => (
                    <div className="project-card" key={repo.id}>
                        <h3>{repo.name}</h3>

                        <p>⭐ Stars: {repo.stargazers_count}</p>

                        <p>{repo.description || "No description available."}</p>

                        <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noreferrer"
                        >
                            View Repository
                        </a>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Projects;