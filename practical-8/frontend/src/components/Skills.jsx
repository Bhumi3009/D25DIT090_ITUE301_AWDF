function Skills({ skillList }) {

    return (

        <section
            id="skills"
            className="skillsSection"
        >

            <h2>

                Skills

            </h2>

            <div className="skillContainer">

                {

                    skillList.map((skill) => (

                        <div
                            key={skill}
                            className="skillCard"
                        >

                            {skill}

                        </div>

                    ))

                }

            </div>

        </section>

    );

}

export default Skills;