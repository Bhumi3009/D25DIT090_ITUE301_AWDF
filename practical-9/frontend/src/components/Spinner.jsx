function Spinner() {
    return (
        <div className="spinner-container">
            <div className="spinner"></div>
            <h2>Loading Repositories...</h2>
        </div>
    );
}

export default Spinner;
// When React is fetching data from GitHub, it takes a few seconds.