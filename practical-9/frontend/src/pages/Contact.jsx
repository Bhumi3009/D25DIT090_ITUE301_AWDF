import { useState } from "react";

function Contact() {
    const [message, setMessage] = useState("");
    const [showHelp, setShowHelp] = useState(false);
    return (

        <section className="contact">

            <h1>Contact Me</h1>

            <input
                type="text"
                placeholder="Enter your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />

            <p>

                You typed: {message}

            </p>

            <p>

                Characters: {message.length}

            </p>

            <button
                onClick={() => setShowHelp(!showHelp)}
            >

                {showHelp ? "Hide Help" : "Show Help"}

            </button>

            {

                showHelp && (

                    <div className="help-box">

                        Enter your message above.
                        This is a controlled input using useState.

                    </div>

                )

            }

        </section>

    );

}

export default Contact;