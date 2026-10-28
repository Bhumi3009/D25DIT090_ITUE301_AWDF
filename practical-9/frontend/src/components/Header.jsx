function Header({ name }) {

    return (

        <section id="home" className="hero">

            <p className="intro">
                HELLO THERE,
            </p>

            <h1>

                {name}

            </h1>

            <h3>

                Information Technology Student

            </h3>

            <p className="heroText">

                Passionate about creating beautiful web applications,
                learning modern technologies and solving real-world
                problems through code.

            </p>

            <a href="#about">

                <button>

                    Explore

                </button>

            </a>

        </section>

    );

}

export default Header;