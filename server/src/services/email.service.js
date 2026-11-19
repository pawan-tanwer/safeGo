const  nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.USER_EMAIL,
        pass:process.env.USER_PASS
    }
});


const sendOtpEmail = async (email, otp) => {
    console.log("BREVO key:", process.env.BREVO_API_KEY?.slice(0, 9), process.env.BREVO_API_KEY?.length);
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: "SafeGo", email: process.env.USER_EMAIL },
      to: [{ email }],
      subject: "SafeGo Email Verification",
      htmlContent: `<h2>Verify your SafeGo account</h2>
        <p>Your OTP is:</p><h1>${otp}</h1>
        <p>This OTP will expire in 5 minutes. Do not share it with anyone.</p>`,
    }),
  });
  if (!res.ok) throw new Error(`Email API ${res.status}: ${await res.text()}`);
};

module.exports ={
    sendOtpEmail
}