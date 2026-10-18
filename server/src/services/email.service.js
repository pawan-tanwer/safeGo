const  nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.USER_EMAIL,
        pass:process.env.USER_PASS
    }
});


const sendOtpEmail = async(email,otp)=>{
    await transporter.sendMail({
        from:`"SafeGo" <${process.env.USER_EMAIL}>`,
        to:email,
        subject:"SafeGo Email Verification",
        html:`
        <h2>Verify your SafeGo account</h2>
        <p>Your Verification OTP is :</p>

        <h1>${otp}</h1>

        <p>This OTP will expire in 5 minutes.</p>
        <p>Do not share this OTP with anyone</p>
        `
    })
}

module.exports ={
    sendOtpEmail
}