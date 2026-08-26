/* ============================================================
   SACHIN MAURYA PORTFOLIO
   MAIN JAVASCRIPT
   ============================================================ */


/* ============================================================
   WAIT FOR PAGE
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {


    /* ========================================================
       1. HERO BOOT TEXT
       ======================================================== */

    const bootText =
        document.getElementById("bootText");


    const bootMessage =
        "BOOTING SACHIN_MAURYA.PCB ... SYSTEM ONLINE";


    if (bootText) {

        let i = 0;


        function typeBoot() {

            if (i < bootMessage.length) {

                bootText.textContent +=
                    bootMessage.charAt(i);

                i++;


                setTimeout(
                    typeBoot,
                    45
                );

            }

        }


        typeBoot();

    }



    /* ========================================================
       2. CUSTOM CURSOR
       ======================================================== */

    const cursorDot =
        document.querySelector(".cursor-dot");


    const cursorGlow =
        document.querySelector(".cursor-glow");


    const hasMouse =
        window.matchMedia(
            "(hover: hover) and (pointer: fine)"
        ).matches;


    if (
        hasMouse &&
        cursorDot &&
        cursorGlow
    ) {

        let mouseX = 0;
        let mouseY = 0;

        let glowX = 0;
        let glowY = 0;


        document.addEventListener(
            "mousemove",
            (event) => {

                mouseX =
                    event.clientX;

                mouseY =
                    event.clientY;


                cursorDot.style.left =
                    mouseX + "px";

                cursorDot.style.top =
                    mouseY + "px";

            }
        );


        function animateGlow() {

            glowX +=
                (mouseX - glowX) * 0.08;

            glowY +=
                (mouseY - glowY) * 0.08;


            cursorGlow.style.left =
                glowX + "px";

            cursorGlow.style.top =
                glowY + "px";


            requestAnimationFrame(
                animateGlow
            );

        }


        animateGlow();


        document.addEventListener(
            "mousedown",
            () => {

                cursorDot.classList.add(
                    "is-clicking"
                );

            }
        );


        document.addEventListener(
            "mouseup",
            () => {

                cursorDot.classList.remove(
                    "is-clicking"
                );

            }
        );


        const interactive =
            document.querySelectorAll(
                "a, button, input, textarea, .ic-chip, .portfolio-bot"
            );


        interactive.forEach(
            element => {

                element.addEventListener(
                    "mouseenter",
                    () => {

                        cursorDot.classList.add(
                            "is-hovering"
                        );

                    }
                );


                element.addEventListener(
                    "mouseleave",
                    () => {

                        cursorDot.classList.remove(
                            "is-hovering"
                        );

                    }
                );

            }
        );

    }



    /* ========================================================
       3. GENERAL SCROLL REVEAL
       ======================================================== */

    const revealElements =
        document.querySelectorAll(
            ".reveal"
        );


    if (
        revealElements.length > 0
    ) {

        const revealObserver =
            new IntersectionObserver(

                (entries) => {

                    entries.forEach(
                        entry => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "in-view"
                                );

                            }

                        }
                    );

                },

                {
                    threshold: 0.12
                }

            );


        revealElements.forEach(
            element => {

                revealObserver.observe(
                    element
                );

            }
        );

    }



    /* ========================================================
       4. ROBOT
       ======================================================== */

    const robotText =
        document.getElementById(
            "robotText"
        );


    const robot =
        document.getElementById(
            "portfolioBot"
        );


    const robotMessages = [

        "Hi! I'm Sachin Maurya, an Electronics & Communication Engineering student and aspiring Full-Stack Developer.",

        "Sachin is passionate about web development, programming, electronics and IoT.",

        "His major project is AR Indoor Navigation using QR localization and the A* pathfinding algorithm.",

        "He also developed an IoT Lab Automation system using ESP32 and sensors.",

        "He has also worked on web projects including a To-Do List and Weather App.",

        "Explore the portfolio to learn more about Sachin and his work."

    ];


    let robotIndex = 0;


    function changeRobotMessage() {

        if (!robotText) return;


        robotText.style.opacity =
            "0";


        setTimeout(
            () => {

                robotText.textContent =
                    robotMessages[
                        robotIndex
                    ];


                robotText.style.opacity =
                    "1";


                robotIndex++;


                if (
                    robotIndex >=
                    robotMessages.length
                ) {

                    robotIndex = 0;

                }

            },
            300
        );

    }


    if (
        robot &&
        robotText
    ) {

        /* Start */

        setTimeout(
            changeRobotMessage,
            1200
        );


        /* Change every 6 seconds */

        setInterval(
            changeRobotMessage,
            6000
        );


        /* Extra message on hover */

        robot.addEventListener(
            "mouseenter",
            () => {

                robotText.style.opacity =
                    "0";


                setTimeout(
                    () => {

                        robotText.textContent =
                            "Scroll down — I'll tell you about Sachin and his projects.";

                        robotText.style.opacity =
                            "1";

                    },
                    250
                );

            }
        );


        robot.addEventListener(
            "mouseleave",
            () => {

                robotText.style.opacity =
                    "0";


                setTimeout(
                    () => {

                        robotText.textContent =
                            robotMessages[
                                robotIndex
                            ];

                        robotText.style.opacity =
                            "1";

                    },
                    250
                );

            }
        );

    }



    /* ========================================================
       5. ABOUT ME TERMINAL
       ======================================================== */

    const aboutTerminal =
        document.getElementById(
            "aboutTerminal"
        );


    const introLines = [

        "SYSTEM: Sachin Maurya profile detected.",

        "ROLE: Electronics & Communication Engineering Student.",

        "FOCUS: Full-Stack Development + Electronics + IoT.",

        "PROJECTS: AR Navigation + IoT Lab Automation + Web Apps.",

        "STATUS: Learning, building and solving real-world problems."

    ];


    const introElements = [

        document.getElementById(
            "introLine1"
        ),

        document.getElementById(
            "introLine2"
        ),

        document.getElementById(
            "introLine3"
        ),

        document.getElementById(
            "introLine4"
        ),

        document.getElementById(
            "introLine5"
        )

    ];


    let terminalStarted =
        false;


    function sleep(ms) {

        return new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    ms
                )
        );

    }


    function typeLine(
        element,
        text,
        speed = 25
    ) {

        return new Promise(
            resolve => {

                if (!element) {

                    resolve();

                    return;

                }


                let i = 0;


                const timer =
                    setInterval(
                        () => {

                            element.textContent =
                                text.substring(
                                    0,
                                    i
                                );

                            i++;


                            if (
                                i >
                                text.length
                            ) {

                                clearInterval(
                                    timer
                                );

                                resolve();

                            }

                        },
                        speed
                    );

            }
        );

    }


    async function startTerminal() {

        if (
            terminalStarted
        ) {

            return;

        }


        terminalStarted =
            true;


        if (
            aboutTerminal
        ) {

            aboutTerminal.classList.add(
                "terminal-active"
            );

        }


        for (
            let i = 0;
            i < introLines.length;
            i++
        ) {

            await typeLine(
                introElements[i],
                introLines[i],
                22
            );


            await sleep(
                300
            );

        }

    }


    if (
        aboutTerminal
    ) {

        const terminalObserver =
            new IntersectionObserver(

                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                entry.isIntersecting
                            ) {

                                startTerminal();


                                terminalObserver.unobserve(
                                    aboutTerminal
                                );

                            }

                        }
                    );

                },

                {
                    threshold:
                        0.25
                }

            );


        terminalObserver.observe(
            aboutTerminal
        );

    }



    /* ========================================================
       6. PROJECT CARD STAGGER
       ======================================================== */

    const projectCards =
        document.querySelectorAll(
            ".project-card"
        );


    projectCards.forEach(
        (card, index) => {

            card.style.transitionDelay =
                `${index * 80}ms`;

        }
    );



    /* ========================================================
       7. CONTACT FORM
       ======================================================== */

    const contactForm =
        document.getElementById(
            "contactForm"
        );


    const formStatus =
        document.getElementById(
            "formStatus"
        );


    if (
        contactForm &&
        formStatus
    ) {

        contactForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                formStatus.textContent =
                    "MESSAGE READY — connect an email service to receive submissions.";


                formStatus.className =
                    "form-status success";

            }
        );

    }



    /* ========================================================
       8. NAVIGATION
       ======================================================== */

    const navLinks =
        document.querySelectorAll(
            '.pin-nav a[href^="#"]'
        );


    navLinks.forEach(
        link => {

            link.addEventListener(
                "click",
                event => {

                    const targetId =
                        link.getAttribute(
                            "href"
                        );


                    const target =
                        document.querySelector(
                            targetId
                        );


                    if (!target) {

                        return;

                    }


                    event.preventDefault();


                    target.scrollIntoView({

                        behavior:
                            "smooth",

                        block:
                            "start"

                    });

                }
            );

        }
    );



    /* ========================================================
       9. PROJECT HOVER EFFECT
       ======================================================== */

    projectCards.forEach(
        card => {

            card.addEventListener(
                "mousemove",
                event => {

                    const rect =
                        card.getBoundingClientRect();


                    const x =
                        event.clientX -
                        rect.left;


                    const y =
                        event.clientY -
                        rect.top;


                    const centerX =
                        rect.width / 2;


                    const centerY =
                        rect.height / 2;


                    const rotateX =
                        (
                            y -
                            centerY
                        ) /
                        30;


                    const rotateY =
                        (
                            centerX -
                            x
                        ) /
                        30;


                    card.style.transform =
                        `translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

                }
            );


            card.addEventListener(
                "mouseleave",
                () => {

                    card.style.transform =
                        "";

                }
            );

        }
    );

});