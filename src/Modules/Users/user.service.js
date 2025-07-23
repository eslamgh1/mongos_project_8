import userModel from "../../DB/Models/user.model.js";
import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";

// find => [{}], []
// findOne =>  {} , null
//findById => {} , null
//& 1. Signup
export const signUpService = async (req, res) => {
  try {
    const { name, email, password, phone, age } = req.body;
    const isEmailExist = await userModel.findOne({ email });
    if (isEmailExist) {
      return res
        .status(409)
        .json({ message: "Email already exists:", isEmailExist });
    }

    //hash_password
    const hash = bcrypt.hashSync(password, 8);
    // Encrypt
    var encryptPhone = CryptoJS.AES.encrypt("phone", "key_123").toString();

    const user = await userModel.create({
      name,
      email: email,
      password: hash,
      phone: encryptPhone,
      age,
    });

    return res
      .status(201)
      .json({ message: "user is created successfully", user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
//& 2. Create an API for authenticating users (Login)
export const loginService = async (req, res) => {
  try {
    const { email, password } = req.body;
    //find email/user
    // findOne = isEmailExist is returning object
    const isEmailExist = await userModel.findOne({ email });
    if (!isEmailExist) {
      return res.status(400).json({ message: "Invalid Email or password:" });
    }

    //Match_password
    const match = await bcrypt.compare(password, isEmailExist.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid password or email" });
    }

    //Create Token
    const token = jwt.sign({ id: isEmailExist._id, email }, "key_2011", {
      expiresIn: "1h",
    });

    return res.status(201).json({ message: "Login successfully", token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};
//& 3. Update logged-in user information

export const updateUser = async (req, res) => {
  try {
    const { authorization } = req.headers;

    console.log({ headers: req.headers, authorization });

    const decoded = jwt.verify(authorization, "key_2011");
    console.log(decoded);
    const { name, email, age } = req.body;
    // findOne => Find user by Id in userModel
    const user = await userModel.findById(decoded.id);
    // findOne => check if user found
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    // findOne => check if email existed
    const isEmailExist = await userModel.findOne({ email });
    if (isEmailExist) {
      return res.status(400).json({ message: "email already exists" });
    }
    // update stage:
    if (name) user.name = name;
    if (email) user.email = email;
    if (age) user.age = age;

    await user.save();

    return res.status(201).json({ message: "User is updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

//& Delete logged-in user. (Get the id for the logged-in user (userId)

export const deleteUser = async (req, res) => {
  try {
    const { authorization } = req.headers;

    console.log({ headers: req.headers, authorization });

    const decoded = jwt.verify(authorization, "key_2011");
    console.log(decoded);

    // deleteOne => Find user by Id in userModel
    const deleteOneResult = await userModel.deleteOne({ _id: decoded.id });
    //check if existed
    if (!deleteOneResult.deletedCount) {
      return res.status(401).json({ message: "User not found" });
    }

    return res.status(201).json({ message: "User is deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

//& 5. Get logged-in user data by his ID

export const getUser = async (req, res) => {
  try {
    const { authorization } = req.headers;

    console.log({ headers: req.headers, authorization });

    const decoded = jwt.verify(authorization, "key_2011");
    console.log(decoded);

    // findOne => Find user by Id in userModel
    const user = await userModel.findById(decoded.id);
    // findOne => check if user found
    if (!user) {
      return res.status(400).json({ message: "user not found"});
    }

    return res.status(201).json({ message: "success" ,user, decoded});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};
