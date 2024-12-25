const User = require("../models/user");
const sendEmail = require("../utils/sendEmail");

// Register function
const register = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try{
        if(!firstName || !lastName || !email || !password) {
         return res.status(404)
            .json({success: false, message: "Please input all fields"});
        }

        // Check for user
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(409)
                    .json({ success: false, message: "User already exist"})
        }

        // create User
        const user = await User.create({
            email,
            firstName,
            lastName,
            password
        });


        const options = {
            email: email,
            subject: "Welcome to our application",
            emailBody: `Welcome to Backend-Weekend`
        }
        await sendEmail(options)

        const token = user.getSignedJwtToken();

        return res.status(201)
        .json({ success: true, message: "user created successfully", token})
    } catch(err){
        console.error("something went wrong:", err);
        res.status(500).json({ error: "Something went wrong" });
    }
}

// Login function

const login = async (req, res) => {
 const {email, password} = req.body

 // Validate email and password
  if(!email){
    return res 
      .status(400)
      .json({ success: false, message: "Please input an email"})
  }

  if(!password){
    return res 
      .status(400)
      .json({ success: false, message: "Please input your password "})
  }

  //Check if the user is registered in the database
  const user = await User.findOne({ email })
  if(!user) {
    return res 
      .status(401)
      .json({ success: false, message: "User does not exist"})
  }

   //check if password matches
   const isMatch = await user.matchPassword(password)
   if(!isMatch){
    return res 
       .status(422)
       .json({ success: false, message: "Invalid Password"})
   }

   const token = user.getSignedJwtToken();
   return res.status(200)
    .json({success: true, message: "Login successful", token})
}

const updateDetails = async (req, res) => {
    const fieldsToUpdate = {
        firstName: req.body.firstName,
        lastName: req.body.lastName
    };
   const user = await User.findByIdAndUpdate(
    req.params.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
   });

   return res.status(200)
           .json({success: true,
             message: "User Details updated successfully", 
             user})

}

const updatePassword = async(req, res) => {
    const user = await User.findById(req.params.id).select("+password");

    //check current password
    if(!(await user.matchPassword(req.body.currentPassword))){
        return res
             .status(401)
             .json({ success: false, message: "Password is incorrect"})
    }

    user.password = req.body.newPassword;
    await user.save();

    res.status(200).json({success: true, message: "Password updated"})
}

const deleteUser = async(req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    
    res.status(200).json({success: true, message: "User deleted"})
}

// Fetch a single user
const getUser = async(req, res) => {
    const user = await User.findById(req.params.id);
    
    res.status(200).json({ success: true, message: "User details retrieved", user})
}

// fetch all users in the db
const getUsers = async (req, res) => {
    const users = await User.find();

    res.status(200).json({success: true, message: "Users details retrieved", users})
}

const forgotPassword = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return res.status(404)
                   .json({
                    success: false,
                    message: "No user found"
                   });
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/resetpassword/${resetToken}`

    const message = `You are receiving this email because you or someone else has requested the reset of a password. Please make a request to: \n \n ${resetUrl}`

    const options = {
        email:user.email,
        subject: "Reset Password",
        emailBody: message,
    }

    try {
        await sendEmail(options);
        return res.status(200).json({ success: true, message: "Email Sent"});
    } catch (error) {
        console.log(error);
        
        user.getResetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false})

        return res.status(500)
        .json({ success: false, message: "Something went wrong"})
    }
};

const resetPassword = async (req, res) =>{

    const resetPasswordToken = crypto
    .createHash("Sha256")
    .update(req.params.resettoken)
    .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return res.status(400).json({sucess: false, message:"Invalid Token"});
    }

    //set password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();


    return res.status(200).json({ success: true, message:"Password updated"})
}


module.exports = {
    register,
    login,
    updateDetails,
    deleteUser,
    getUser,
    getUsers,
    updatePassword,
    forgotPassword
};


/**
 * POST
 * PUT
 * DELETE
 * 
 * -- GET
 * 
 */