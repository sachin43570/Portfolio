/* SACHIN MAURYA PORTFOLIO — MAIN JAVASCRIPT */
/* ================================
   GOOGLE SIGN-IN
================================ */
const GOOGLE_CLIENT_ID="635915238420-7eqjccak4skat66d3r7eotf912oascei.apps.googleusercontent.com";
let googleUser={name:"",email:"",picture:"",credential:""};
function handleGoogleLogin(response){
  try{
    const payload=JSON.parse(atob(response.credential.split(".")[1].replace(/-/g,"+").replace(/_/g,"/")));
    googleUser.name=payload.name||"";
    googleUser.email=payload.email||"";
    googleUser.picture=payload.picture||"";
    googleUser.credential=response.credential;
    console.log("Google login successful:",{name:googleUser.name,email:googleUser.email});
    localStorage.setItem("portfolioGoogleUser",JSON.stringify({
      name:googleUser.name,
      email:googleUser.email,
      picture:googleUser.picture
    }));
    unlockPortfolio();
  }catch(error){
    console.error("Google login error:",error);
    const status=document.getElementById("googleAuthStatus");
    if(status)status.textContent="Google sign-in failed. Please try again.";
  }
}
function unlockPortfolio(){
  const gate=document.getElementById("googleAuthGate");
  if(gate){
    gate.classList.add("google-auth-hidden");
    gate.style.display="none";
  }
  document.body.classList.remove("portfolio-locked");
  document.body.style.overflow="auto";
  const nameInput=document.getElementById("name");
  const emailInput=document.getElementById("email");
  if(nameInput)nameInput.value=googleUser.name;
  if(emailInput){
    emailInput.value=googleUser.email;
    emailInput.readOnly=true;
  }
}
function initializeGoogleSignIn(){
  if(typeof google==="undefined"||!google.accounts||!google.accounts.id){
    console.error("Google Identity Services did not load.");
    return false;
  }
  const googleButton=document.getElementById("googleSignInButton");
  if(!googleButton){
    console.error("Google Sign-In button container not found.");
    return false;
  }
  googleButton.innerHTML="";
  google.accounts.id.initialize({
    client_id:GOOGLE_CLIENT_ID,
    callback:handleGoogleLogin,
    auto_select:false,
    cancel_on_tap_outside:true
  });
  google.accounts.id.renderButton(googleButton,{
    theme:"outline",
    size:"large",
    type:"standard",
    text:"signin_with",
    shape:"rectangular",
    logo_alignment:"left",
    width:280
  });
  return true;
}
function waitForGoogleSignIn(){
  let attempts=0;
  const maxAttempts=50;
  const timer=setInterval(()=>{
    attempts++;
    if(initializeGoogleSignIn()){
      clearInterval(timer);
    }else if(attempts>=maxAttempts){
      clearInterval(timer);
      const status=document.getElementById("googleAuthStatus");
      if(status)status.textContent="Google Sign-In is unavailable. Please refresh the page.";
    }
  },200);
}
/* ================================
   BACKEND
================================ */
const CONTACT_API_URL="https://portfolio-wn7q.onrender.com/send-message";
/* ================================
   MAIN
================================ */
document.addEventListener("DOMContentLoaded",()=>{
  waitForGoogleSignIn();
  /* 0. Auto-sync header height */
  const headerEl=document.querySelector("header");
  if(headerEl){
    const syncHeaderHeight=()=>{
      document.documentElement.style.setProperty("--header-h",headerEl.offsetHeight+"px");
    };
    syncHeaderHeight();
    if(typeof ResizeObserver!=="undefined"){
      new ResizeObserver(syncHeaderHeight).observe(headerEl);
    }
    window.addEventListener("resize",syncHeaderHeight);
    window.addEventListener("orientationchange",syncHeaderHeight);
  }
  /* 1. Hero boot text */
  const bootText=document.getElementById("bootText");
  const bootMessage="BOOTING SACHIN_MAURYA.PCB ... SYSTEM ONLINE";
  if(bootText){
    let i=0;
    function typeBoot(){
      if(i<bootMessage.length){
        bootText.textContent+=bootMessage.charAt(i);
        i++;
        setTimeout(typeBoot,45);
      }
    }
    typeBoot();
  }
  /* 2. Custom cursor */
  const cursorDot=document.querySelector(".cursor-dot");
  const cursorGlow=document.querySelector(".cursor-glow");
  const hasMouse=window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if(hasMouse&&cursorDot&&cursorGlow){
    let mouseX=0;
    let mouseY=0;
    let glowX=0;
    let glowY=0;
    document.addEventListener("mousemove",event=>{
      mouseX=event.clientX;
      mouseY=event.clientY;
      cursorDot.style.left=mouseX+"px";
      cursorDot.style.top=mouseY+"px";
    });
    function animateGlow(){
      glowX+=(mouseX-glowX)*0.08;
      glowY+=(mouseY-glowY)*0.08;
      cursorGlow.style.left=glowX+"px";
      cursorGlow.style.top=glowY+"px";
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
    document.addEventListener("mousedown",()=>{
      cursorDot.classList.add("is-clicking");
    });
    document.addEventListener("mouseup",()=>{
      cursorDot.classList.remove("is-clicking");
    });
    const interactive=document.querySelectorAll("a,button,input,textarea,.card,.info-card,.portfolio-bot");
    interactive.forEach(element=>{
      element.addEventListener("mouseenter",()=>{
        cursorDot.classList.add("is-hovering");
      });
      element.addEventListener("mouseleave",()=>{
        cursorDot.classList.remove("is-hovering");
      });
    });
  }
  /* 3. Scroll reveal: dim + blurred -> sharp while rising; cards stagger; inner items cascade.
        Works on desktop and touch (IntersectionObserver, no scroll listeners). Replays when scrolling back. */
  const revealElements=[...document.querySelectorAll(".reveal,.reveal-group")];
  if(revealElements.length>0){
    const CHILD_SEL=[
      ".card-head",".card-head + p",".card > p",".card > h4",".project-desc",".project-info > h4",".impact",
      ".dot-list li",".tag-row span",".card .btn",".pill",".browser-mock",".stat-card",
      ".hero-text > *",".hero-banner > *",".contact-left > *",".contact-right > h3",
      ".contact-right input",".contact-right textarea",".contact-right form > .btn",".quick-actions",".avail"
    ].join(",");
    const siblingCount=new Map();
    revealElements.forEach(el=>{
      const parent=el.parentElement;
      const n=siblingCount.get(parent)||0;
      siblingCount.set(parent,n+1);
      /* cards in the same grid row-order stagger left->right, top->bottom (capped) */
      el.style.setProperty("--d",(Math.min(n,3)*0.12).toFixed(2)+"s");
      const candidates=[...el.querySelectorAll(CHILD_SEL)];
      const kids=candidates.filter(c=>!candidates.some(o=>o!==c&&o.contains(c)));
      kids.forEach((kid,i)=>{
        kid.classList.add("rv-child");
        kid.style.setProperty("--i",Math.min(i,14));
      });
    });
    if("IntersectionObserver" in window){
      const revealObserver=new IntersectionObserver(entries=>{
        entries.forEach(entry=>{
          entry.target.classList.toggle("in-view",entry.isIntersecting);
        });
      },{threshold:0,rootMargin:"0px 0px -9% 0px"});
      revealElements.forEach(element=>revealObserver.observe(element));
    }else{
      revealElements.forEach(element=>element.classList.add("in-view"));
    }
  }
  /* 4. Robot */
  const robotText=document.getElementById("robotText");
  const robot=document.getElementById("portfolioBot");
  const robotMessages=[
    "Hi! I'm Sachin's portfolio assistant. I'll help you explore his profile, skills, and projects.",
    "Sachin Maurya is an Electronics & Communication Engineering student and an aspiring Full-Stack Developer.",
    "He has a strong interest in web development, programming, electronics, IoT, and software engineering.",
    "His projects include VoltMap, an AR Based Indoor Navigation System, and an Inventory Management system.",
    "He has also developed practical web applications such as a To Do List and a Weather App.",
    "You can explore the Skills section to see his technical knowledge and the Projects section to learn about his work.",
    "Want to know more about Sachin? Scroll through the portfolio and I'll guide you along the way."
  ];
  let robotIndex=0;
  function changeRobotMessage(){
    if(!robotText)return;
    robotText.style.opacity="0";
    setTimeout(()=>{
      robotText.textContent=robotMessages[robotIndex];
      robotText.style.opacity="1";
      robotIndex++;

      if(robotIndex>=robotMessages.length){
        robotIndex=0;
      }
    },300);
  }
  if(robot&&robotText){
    setTimeout(changeRobotMessage,1200);
    setInterval(changeRobotMessage,6000);
    robot.addEventListener("mouseenter",()=>{
      robotText.style.opacity="0";
      setTimeout(()=>{
        robotText.textContent="Scroll down — I'll tell you about Sachin and his projects.";
        robotText.style.opacity="1";
      },250);
    });
    robot.addEventListener("mouseleave",()=>{
      robotText.style.opacity="0";
      setTimeout(()=>{
        robotText.textContent=robotMessages[robotIndex];
        robotText.style.opacity="1";
      },250);
    });
  }
  /* 4.5 Robot position - PC and mobile (unified, uses visualViewport) */
  const footerEl=document.querySelector("footer");
  const BOT_GAP=3;
  function updateBotPosition(){
    if(!robot)return;
    if(!footerEl){
      robot.style.bottom=BOT_GAP+"px";
      return;
    }
    const footerRect=footerEl.getBoundingClientRect();
    const viewportHeight=window.visualViewport?window.visualViewport.height:window.innerHeight;
    const overlap=viewportHeight-footerRect.top;
    if(overlap>0){
      robot.style.bottom=(overlap+BOT_GAP)+"px";
    }else{
      robot.style.bottom=BOT_GAP+"px";
    }
  }
  if(robot){
    window.addEventListener("scroll",()=>{
      requestAnimationFrame(updateBotPosition);
    },{passive:true});
    window.addEventListener("resize",updateBotPosition);
    window.addEventListener("orientationchange",updateBotPosition);
    if(window.visualViewport){
      window.visualViewport.addEventListener("resize",updateBotPosition);
      window.visualViewport.addEventListener("scroll",updateBotPosition);
    }
    updateBotPosition();
  }
  /* 4.6 Hide bot while a form field is focused (prevents keyboard overlap) */
  const formFields=document.querySelectorAll("#contactForm input, #contactForm textarea");
  formFields.forEach(field=>{
    field.addEventListener("focus",()=>{
      if(robot)robot.classList.add("bot-hidden");
    });
    field.addEventListener("blur",()=>{
      if(robot)robot.classList.remove("bot-hidden");
      updateBotPosition();
    });
  });
  /* 5. About Me terminal */
  const aboutTerminal=document.getElementById("aboutTerminal");
  const introLines=[
    "SYSTEM: Sachin Maurya profile detected.",
    "ROLE: Electronics & Communication Engineering Student.",
    "FOCUS: Full-Stack Development + Electronics + IoT.",
    "PROJECTS: AR Navigation + Inventory Management + Web Apps.",
    "STATUS: Learning, building and solving real-world problems."
  ];
  const introElements=[
    document.getElementById("introLine1"),
    document.getElementById("introLine2"),
    document.getElementById("introLine3"),
    document.getElementById("introLine4"),
    document.getElementById("introLine5")
  ];
  let terminalStarted=false;
  function sleep(ms){
    return new Promise(resolve=>setTimeout(resolve,ms));
  }
  function typeLine(element,text,speed=25){
    return new Promise(resolve=>{
      if(!element){
        resolve();
        return;
      }
      let i=0;
      const timer=setInterval(()=>{
        element.textContent=text.substring(0,i);
        i++;
        if(i>text.length){
          clearInterval(timer);
          resolve();
        }
      },speed);
    });
  }
  async function startTerminal(){
    if(terminalStarted)return;
    terminalStarted=true;
    if(aboutTerminal){
      aboutTerminal.classList.add("terminal-active");
    }
    for(let i=0;i<introLines.length;i++){
      await typeLine(introElements[i],introLines[i],22);
      await sleep(300);
    }
  }
  if(aboutTerminal){
    const terminalObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          startTerminal();
          terminalObserver.unobserve(aboutTerminal);
        }
      });
    },{threshold:0.25});
    terminalObserver.observe(aboutTerminal);
  }
  /* 6. Project previews: real screenshot (images/projects/*.png) if present, otherwise a live scaled preview of the deployed site */
  const IFRAME_W=1280,IFRAME_H=800;
  function buildLivePreview(mock){
    const screen=mock.querySelector(".browser-screen");
    const url=mock.dataset.live;
    if(!screen||!url)return;
    const frame=document.createElement("iframe");
    frame.src=url;
    frame.title="Live preview";
    frame.loading="lazy";
    frame.tabIndex=-1;
    frame.setAttribute("aria-hidden","true");
    frame.setAttribute("referrerpolicy","no-referrer");
    frame.setAttribute("sandbox","allow-scripts allow-same-origin");
    frame.width=IFRAME_W;frame.height=IFRAME_H;
    const fit=()=>{frame.style.transform="scale("+(screen.clientWidth/IFRAME_W)+")";};
    frame.addEventListener("load",()=>{
      const fb=mock.querySelector(".shot-fallback");
      if(fb)fb.remove();
    });
    screen.appendChild(frame);
    fit();
    if(typeof ResizeObserver!=="undefined")new ResizeObserver(fit).observe(screen);
    else window.addEventListener("resize",fit);
  }
  function loadPreview(mock){
    const screen=mock.querySelector(".browser-screen");
    const fallback=mock.querySelector(".shot-fallback");
    const img=new Image();
    img.alt="Project screenshot";
    img.decoding="async";
    img.onload=()=>{if(fallback)fallback.remove();screen.appendChild(img);};
    img.onerror=()=>buildLivePreview(mock);
    img.src=mock.dataset.shot;
  }
  const mocks=document.querySelectorAll(".browser-mock[data-shot]");
  if("IntersectionObserver" in window){
    const previewObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          previewObserver.unobserve(entry.target);
          loadPreview(entry.target);
        }
      });
    },{rootMargin:"300px 0px"});
    mocks.forEach(mock=>previewObserver.observe(mock));
  }else{
    mocks.forEach(loadPreview);
  }

  /* 6.5 Per-card accent colour (taken from each card's logo/icon) + cursor spotlight inside cards */
  const ACCENTS={blue:"91,157,255",purple:"167,139,250",pink:"244,114,182",orange:"251,146,60",teal:"45,212,191",green:"52,211,153",yellow:"250,204,21",copper:"231,168,104"};
  const accentCards=document.querySelectorAll(".card,.stat-card,.info-card");
  accentCards.forEach(el=>{
    const tile=el.querySelector(".icon-tile");
    if(tile){
      /* exact colours of this card's own icon (set per icon class in style.css) */
      const cs=getComputedStyle(tile);
      const c1=cs.getPropertyValue("--c1").trim();
      const c2=cs.getPropertyValue("--c2").trim();
      if(c1){
        el.style.setProperty("--acc",c1);
        el.style.setProperty("--acc2",c2||c1);
        return;
      }
    }
    const source=el.querySelector("b");
    const match=source&&source.className.match(/\bc-(blue|purple|pink|orange|teal|green|yellow|copper)\b/);
    if(match){
      el.style.setProperty("--acc",ACCENTS[match[1]]);
      el.style.setProperty("--acc2",ACCENTS[match[1]]);
    }
  });
  if(window.matchMedia("(hover: hover) and (pointer: fine)").matches){
    document.querySelectorAll(".card").forEach(card=>{
      card.addEventListener("mousemove",event=>{
        const rect=card.getBoundingClientRect();
        card.style.setProperty("--mx",(event.clientX-rect.left)+"px");
        card.style.setProperty("--my",(event.clientY-rect.top)+"px");
      });
      card.addEventListener("mouseleave",()=>{
        card.style.removeProperty("--mx");
        card.style.removeProperty("--my");
      });
    });
  }
  /* 7. Contact form */
  const contactForm=document.getElementById("contactForm");
  const formStatus=document.getElementById("formStatus");
  const sendBtn=document.getElementById("sendBtn");
  if(contactForm&&formStatus){
    contactForm.addEventListener("submit",async event=>{
      event.preventDefault();
      if(!googleUser.email||!googleUser.credential){
        formStatus.textContent="Please sign in with Google before sending a message.";
        formStatus.className="form-status error";
        return;
      }
      const nameInput=document.getElementById("name");
      const messageInput=document.getElementById("message");
      const name=nameInput?nameInput.value.trim():"";
      const message=messageInput?messageInput.value.trim():"";
      if(!name||!message){
        formStatus.textContent="Please fill in your name and message.";
        formStatus.className="form-status error";
        return;
      }
      if(sendBtn){
        sendBtn.disabled=true;
        sendBtn.textContent="Sending...";
      }
      formStatus.textContent="Sending your message...";
      formStatus.className="form-status";
      try{
        const response=await fetch(CONTACT_API_URL,{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({
            name:name,
            email:googleUser.email,
            message:message,
            credential:googleUser.credential
          })
        });
        const data=await response.json();
        if(response.ok&&data.success){
          formStatus.textContent="Message sent! I'll get back to you soon.";
          formStatus.className="form-status success";
          if(messageInput){
            messageInput.value="";
          }
        }else{
          formStatus.textContent=data.message||"Something went wrong. Please try again.";
          formStatus.className="form-status error";
        }
      }catch(error){
        console.error("Contact form error:",error);
        formStatus.textContent="Couldn't reach the server. Please try again later.";
        formStatus.className="form-status error";
      }finally{
        if(sendBtn){
          sendBtn.disabled=false;
          sendBtn.textContent="Send Message";
        }
      }
    });
  }
  /* 8. Navigation */
  const navLinks=document.querySelectorAll('.main-nav a[href^="#"], .brand[href^="#"], .hire-btn[href^="#"], .hero a[href^="#"], #about a[href^="#"]');
  navLinks.forEach(link=>{
    link.addEventListener("click",event=>{
      const targetId=link.getAttribute("href");
      const target=document.querySelector(targetId);

      if(!target)return;

      event.preventDefault();

      target.scrollIntoView({
        behavior:"smooth",
        block:"start"
      });
    });
  });
  /* 9. Active nav link while scrolling */
  const spyLinks=[...document.querySelectorAll('.main-nav a[href^="#"]')];
  const spyTargets=spyLinks.map(l=>document.querySelector(l.getAttribute("href")));
  function updateActiveNav(){
    const y=window.scrollY+(headerEl?headerEl.offsetHeight:0)+80;
    let current=0;
    spyTargets.forEach((t,i)=>{if(t&&t.offsetTop<=y)current=i;});
    spyLinks.forEach((l,i)=>l.classList.toggle("active",i===current));
  }
  window.addEventListener("scroll",updateActiveNav,{passive:true});
  updateActiveNav();
});
window.addEventListener("load",()=>{
  if(typeof google!=="undefined"&&google.accounts&&google.accounts.id){
    initializeGoogleSignIn();
  }
});