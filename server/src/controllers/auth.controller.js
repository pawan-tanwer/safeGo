const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model.js");
const otpModel = require("../models/opt.model.js");
const refreshTokenModel = require("../models/refreshToken.model.js");
// services
const { createOtp, createPhoneOtp } = require("../services/otp.service.js");
const { sendOtpEmail } = require("../services/email.service.js");
const { sendSms } = require("../services/sms.service.js");

const jwtToken = require("../utils/jwt.js");

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const register = async (req, res) => {
  try {
    const { name, password, email, phone, role } = req.body;

    if (!name || !password || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const isUserExist = await userModel.findOne({
      $or: [{ email }, { phone }],
    });

    if (isUserExist) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 character",
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const user = await userModel.create({
      name,
      email,
      phone,
      role: role,
      password: hashPassword,
      isEmailVerified: false,
    });

    const otp = await createOtp(user.email, "email-verification");

    res.status(201).json({
      success: true,
      message: "OTP sent to your email",
    });

    await sendOtpEmail(user.email, otp);
  } catch (error) {
    console.error("register error :", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const otpRecord = await otpModel.findOne({
      email,
      type: "email-verification",
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or not found",
      });
    }

    if (otpRecord.attempts >= 5) {
      await otpRecord.deleteOne();

      return res.status(429).json({
        success: false,
        message: "Too many attempts. Please request a new OTP",
      });
    }

    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();

      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    user.isEmailVerified = true;
    await user.save();
    await otpRecord.deleteOne();

    const accessToken = jwtToken.generateAccessToken(user._id, user.role);
    const refreshToken = jwtToken.generateRefreshToken(user._id);
    await refreshTokenModel.create({
      user: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("email verifed error :", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const sendPhoneOtp = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.phone) {
      return res.status(400).json({
        success: false,
        message: "Phone Number is required",
      });
    }

    if (user.isPhoneVerified) {
      return res.status(400).json({
        success: false,
        message: "Phone number is already verified",
      });
    }

    const otp = createPhoneOtp(user.phone, "phone-verification");

    await sendSms(user.phone, otp);

    res.status(200).json({
      success: true,
      message: "Phone verification OTP send successfully",
    });
  } catch (error) {
    console.error("sendPhoneOtp error :", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    const opt = await createOtp(email, "email-verification");
    res.status(200).json({
      success: true,
      message: "new OTP sent successfully",
    });
    await sendOtpEmail(email, otp);
  } catch (error) {
    console.error("resendOtp error :", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const forgotPasswordOtp = async(req,res)=>{
  try {
    const {email} = req.body;
    const user = await userModel.findOne({email});
    if(!user){
      return res.status(404).json({
        success:false,
        message:"Enter the email"
      })
    }

    const otp = await createOtp(user.email, "forgot-password");

    res.status(201).json({
      success:true,
      message:"OTP send to your email"
    })

    await sendOtpEmail(user.email, otp);

  } catch (error) {
    console.error("forgot password error:",error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

const verifyForgotPasswordOtp = async(req,res)=>{
  try {
    const {otp,email}= req.body;
    console.log("otp",otp)
    const isTrue = await otpModel.findOne({email,otp});
    const user = await userModel.findOne({email});
    if(!user){
      return res.status(404).json({
        success:false,
        message:`Account not found on this ${email}`
      })
    }
    if(!isTrue){
      return res.status(404).json({
        success:false,
        message:"OTP expired"
      })
    }
    if(otp != isTrue.otp){
      return res.status(400).json({
        success:false,
        message:"Invalid OTP"
      })
    }
    return res.status(200).json({
      success:true,
      message:"OTP verified"
    })
  } catch (error) {
    
  }
}

const forgotPassword = async(req,res)=>{
  try {
    const {password,email} = req.body;
    const user = await userModel.findOne({
      email
    });
    if(!user){
      return res.status(400).json({
        success:false,
        message:`Account not found on this email ${email}`
      })
    }
    const hashPassword = await bcrypt.hash(password, 12);
    user.password = hashPassword;
    user.save();
    return res.status(200).json({
      success:true,
      message:"Password updated ! login again"
    })
  } catch (error) {
    
  }
}

const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/Phone and password are required",
      });
    }

    const user = await userModel.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is inactive",
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const accessToken = jwtToken.generateAccessToken(user._id, user.role);

    const refreshToken = jwtToken.generateRefreshToken(user._id);

    await refreshTokenModel.create({
      user: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("login error :", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const refreshAccesstoken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "refreshToken not found",
      });
    }

    const decoded = jwtToken.verifyRefreshToken(refreshToken);

    const storeToken = await refreshTokenModel.findOne({
      token: refreshToken,
      user: decoded.userId,
    });

    if (!storeToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh Token",
      });
    }

    const user = await userModel.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User not found or inactive",
      });
    }

    const accessToken = jwtToken.generateAccessToken(user._id, user.role);
    const newRefreshToken = jwtToken.generateRefreshToken(user._id);
    await refreshTokenModel.deleteOne({ token: refreshToken });

    await refreshTokenModel.create({
      user:user._id,
      token:newRefreshToken,
      expiresAt:new Date(Date.now()+7*24*60*60*1000)
    })

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("refreshAccessToken error :", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const logout = async (req, res) => {
  try {
    console.log(req.user)
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await refreshTokenModel.deleteOne({
        token: refreshToken,
        user: req.user._id,
      });
    }

    res.clearCookie("refreshToken");

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const googleAuth = async (req, res) => {
  try {
    const { credential, role } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await userModel.findOne({ email });

    if (!user) {
      try {
        user = await userModel.create({
          name,
          email,
          role,
          password: null,
          profileImage: {
            url: picture,
            publicId: null,
          },
          provider: "google",
          isEmailVerified: true,
        });
      } catch (err) {
        if (err.code === 11000) {
          // another concurrent request already created this user — just fetch it
          user = await userModel.findOne({ email });
        } else {
          throw err;
        }
      }
    }

    const accessToken = jwtToken.generateAccessToken(user._id, user.role);
    const refreshToken = jwtToken.generateRefreshToken(user._id);

    await refreshTokenModel.create({
      user: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Google Login Successful",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("GoogleAuth error :", error);
    res
      .status(401)
      .json({ success: false, message: "Google authentication failed" });
  }
};

const updateProfile = async(req,res)=>{
const {name, phone,newPassword,oldPassword}= req.body;

const userProfile = await userModel.findById(req.user._id);
console.log(userProfile)
if(!userProfile){
  return res.status(400).json({
    success:false,
    message:'Your profile not found'
  })
}

if(name){
  userProfile.name= name;
}
if(phone){
  userProfile.phone = phone;
}

if(oldPassword){
  const hashPassword = await bcrypt.compare(oldPassword,userProfile.password);
  if(!hashPassword){
    return res.status(401).json({
      success:false,
      message:"oldPassword is mismatch"
    })
  }else{
    userProfile.password = await bcrypt.hash(String(newPassword),12);
  }
}

userProfile.save();
return res.status(200).json({
  success:true,
  message:"Updated"
})
}



module.exports = {
  register,
  verifyEmail,
  sendPhoneOtp,
  resendOtp,
  login,
  refreshAccesstoken,
  logout,
  googleAuth,
  updateProfile,
  forgotPasswordOtp,
  verifyForgotPasswordOtp,
  forgotPassword
}