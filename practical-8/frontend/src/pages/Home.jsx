import Header from "../components/Header";
import About from "../components/About";
import Skills from "../components/Skills";
import Footer from "../components/Footer";

function Home() {

    const name = "Meera Turakhiya";

    const skills = [
        "HTML",
        "CSS",
        "JavaScript",
        "React",
        "Python",
        "Java",
        "Git",
        "Machine Learning"
    ];

    return (
        <>
            <Header name={name} />

            <About name={name} />

            <Skills skillList={skills} />

            <Footer />
        </>
    );
}

export default Home;