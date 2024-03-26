import { ObjectId } from "mongodb";
import ValidationError from "../errors/validationError.js";
import EmailService from "../email/emailService.js";

export default class UserController {
  constructor({ userService }) {
    this.userService = userService;
  }

  createUser = async (req, res, next) => {
    const { userName, email, password, role } = req.body;

    try {
      const { user, token } = await this.userService.createUser({
        userName,
        email,
        password,
        isVerified: false,
        role,
      });
      
      // Generate and send verification email
      const verificationToken = user.generateVerificationToken();
      await user.save();
      await EmailService.sendVerificationEmail(email, verificationToken);

      res.status(201).json({
        message: "User created successfully and verification email sent!",
        user: user,
        token: token,
      });
    } catch (err) {
      // Handling known error types directly
      if (err instanceof ValidationError) {
        return res.status(err.statusCode).json({ message: err.message });
      }
      // Passing other errors to the global error handler
      next(err);
    }
  };

  patchUser = async (req, res, next) => {
    const userId = req.params.id;
    const updates = req.body; // Assuming you want to update with the entire req.body
  
    try {
      if (!ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid userId!" });
      }
  
      const updatedUser = await this.userService.patchUser({ userId, ...updates });
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found." });
      }
  
      res.status(200).json({
        message: "User updated successfully!",
        user: updatedUser, // Return the updated user
      });
    } catch (err) {
      next(err);
    }
  };

  updateUser = async (req, res, next) => {
    const userId = req.params.id;
    const { userName, email, password, isVerified, role } = req.body;

    try {
      if (!ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid userId!" });
      }

      const { user } = await this.userService.updateUser({
        userId,
        userName,
        email,
        password,
        isVerified,
        role,
      });

      res.status(200).json({
        message: "User updated successfully!",
        user: user,
      });
    } catch (err) {
      next(err);
    }
  };
  

  deleteUser = async (req, res, next) => {
    const userId = req.params.id;

    try {
      if (!ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid userId!" });
      }

      const { user } = await this.userService.deleteUser(userId);

      res.status(200).json({
        message: `User ${user.userName} deleted successfully!`,
      });
    } catch (err) {
      next(err);
    }
  };

  getUser = async (req, res, next) => {
    const userId = req.params.id;

    try {
      if (!ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid userId!" });
      }

      const { user } = await this.userService.getUser(userId);

      res.status(200).json({
        message: "Fetched user successfully!",
        user: user,
      });
    } catch (err) {
      next(err);
    }
  };

  getUsers = async (req, res, next) => {
    const { pageNum, perPage, status } = req.query;

    try {
      const { users } = await this.userService.getUsers({
        pageNum,
        perPage,
        status,
      });

      res.status(200).json({
        message: "Fetched users successfully!",
        users: users,
      });
    } catch (err) {
      next(err);
    }
  };

  verifyUser = async (req, res, next) => {
    const { token } = req.query;
  
    try {
      const user = await this.userService.verifyUser(token);
  
      if (!user) {
        return res.status(404).json({ message: "Verification failed. User not found or token is invalid." });
      }
  
      res.status(200).json({ message: "User verified successfully!" });
    } catch (err) {
      next(err);
    }
  };

  resendVerification = async (req, res, next) => {
    const { email } = req.body;
  
    try {
      const user = await this.userService.resendVerification({email});
  
      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }

      if (user.isVerified) {
        return res.status(400).json({ message: "User already verified." });
      }

      // Generate and send verification email
      const verificationToken = user.generateVerificationToken();
      await user.save();
      await EmailService.sendVerificationEmail(email, verificationToken);
  
      return res.status(200).json({ message: "Verification email sent!" });
    } catch (err) {
       console.error("Failed to send verification email:", err);
       res.status(503).json({ message: "Service temporarily unavailable, please try again later." });
    }
  };

  // login = async (req, res, next) => {
  //   const { email, password } = req.body;
  
  //   try {
  //     const { user, token } = await this.userService.login({ email, password });
  
  //     res.status(200).json({
  //       message: "User logged in successfully!",
  //       user: user,
  //       token: token,
  //     });
  //   } catch (err) {
  //     next(err);
  //   }
  // };
  
}