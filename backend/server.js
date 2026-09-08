const express=require("express");
const cors=require("cors");
require("dotenv").config();
const {Resend}=require("resend");
const {OAuth2Client}=require("google-auth-library");
const app=express();
const PORT=process.env.PORT||5000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const resend=new Resend(process.env.RESEND_API_KEY);
const googleClient=new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const isValidEmail=(value)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
app.get("/",(req,res)=>{
  res.send("Portfolio backend is running!");
});
app.post("/send-message",async(req,res)=>{
  try{
    const {name,message,credential}=req.body;
    console.log("Contact form received:",{
      name,
      message,
      hasGoogleCredential:!!credential
    });
    if(!name||!message||!credential){
      return res.status(400).json({
        success:false,
        message:"Please sign in with Google and fill all fields."
      });
    }
    let googlePayload;
    try{
      const ticket=await googleClient.verifyIdToken({
        idToken:credential,
        audience:process.env.GOOGLE_CLIENT_ID
      });
      googlePayload=ticket.getPayload();
    }catch(error){
      console.error("Google token verification error:",error);
      return res.status(401).json({
        success:false,
        message:"Google sign-in verification failed. Please sign in again."
      });
    }
    const verifiedEmail=googlePayload.email;
    const verifiedName=googlePayload.name||name;
    if(!verifiedEmail||googlePayload.email_verified!==true){
      return res.status(401).json({
        success:false,
        message:"Your Google email could not be verified."
      });
    }
    if(!isValidEmail(verifiedEmail)){
      return res.status(400).json({
        success:false,
        message:"Invalid Google email address."
      });
    }
    const safeName=String(verifiedName).replace(/[<>]/g,"");
    const safeEmail=String(verifiedEmail).replace(/[<>]/g,"");
    const safeMessage=String(message).replace(/[<>]/g,"");
    const {data,error}=await resend.emails.send({
      from:"Portfolio Contact <onboarding@resend.dev>",
      to:[process.env.GMAIL_USER],
      replyTo:safeEmail,
      subject:`Portfolio Contact: ${safeName}`,
      text:`You received a new message from your portfolio.
Name: ${safeName}
Email: ${safeEmail}
Message:
${safeMessage}`,
      html:`
        <h2>New Portfolio Contact</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage.replace(/\n/g,"<br>")}</p>
        <hr>
        <p>You can reply directly to this email to contact ${safeName}.</p>
      `
    });
    if(error){
      console.error("Resend error:",error);
      return res.status(500).json({
        success:false,
        message:"Failed to send message."
      });
    }
    console.log("Email sent successfully:",data);
    return res.json({
      success:true,
      message:"Message sent successfully!"
    });
  }catch(error){
    console.error("Email error:",error);
    return res.status(500).json({
      success:false,
      message:"Failed to send message."
    });
  }
});
app.listen(PORT,"0.0.0.0",()=>{
  console.log(`Server running on port ${PORT}`);
});