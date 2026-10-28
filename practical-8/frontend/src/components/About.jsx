function About({ name }) {
    return (
        <section
            id="about"
            className="about"
        >
            <div className="aboutLeft">
                <h2>About Me</h2>
                <p>
                    Hi, I'm {name}, currently pursuing Information Technology.
                    I enjoy building responsive websites using React and
                    continuously improving my programming skills.I like to learn modern tools and continuously improving my
                    development skills and i am so much intrested in a data science & data engineering.
                </p>
            </div>
            <div className="aboutRight">
                <div className="infoCard">
                    <h4>Education</h4>
                    <p> CHARUSAT University</p>
                </div>
                <div className="infoCard">
                    <h4>Interests</h4>
                    <p> React • Python • ML</p>
                </div>
            </div>
        </section>
    );
}

export default About;