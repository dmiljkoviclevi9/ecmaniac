import User from "../models/userModel.js";

export default class UserRepository {
    createUser = async (userData) => {
        const user = new User(userData);

        try {
            // Check for an existing user with the same email or userName
            const existingUser = await User.findOne({
                $or: [{ email: userData.email }, { userName: userData.userName }]
            });

            if (existingUser) {
                const error = new Error('User with the provided email or username already exists.');
                error.statusCode = 409;
                throw error;
            }

            const validationError = user.validateSync();

            if (validationError) {
                const error = new Error(validationError.message);
                error.statusCode = 422;
                throw error;
            }

            const result = await user.save();
            const token = await user.generateAuthToken();

            return {
                user: result,
                token: token,
            };
        } catch (err) {
            throw err;
        }
    };

    patchUser = async (userData) => {
        const updates = { ...userData };
        const userId = updates.userId;
        delete updates.userId; // Remove userId from the updates object to avoid attempting to update it

        try {
            // Using findByIdAndUpdate to both update the document and return the updated version
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { $set: updates },
                { new: true, runValidators: true } // Ensures the returned document is the updated document and runs validators
            );

            if (!updatedUser) {
                const error = new Error('User not found');
                error.statusCode = 404;
                throw error;
            }

            return updatedUser; // Return the updated document
        } catch (err) {
            throw err; // Error handling
        }
    };

    updateUser = async (userData) => {
        try {
            const user = await User.findById(userData.userId);

            if (!user) {
                return undefined;
            }

            user.userName = userData.userName;
            user.email = userData.email;
            user.password = userData.password;
            user.isVerified = userData.isVerified;
            user.role = userData.role;

            const validationError = user.validateSync();

            if (validationError) {
                const error = new Error(validationError.message);
                error.statusCode = 422;
                throw error;
            }

            const result = await user.save();

            return {
                user: result,
            };
        } catch (err) {
            throw err;
        }
    };

    deleteUser = async (userId) => {
        try {
            const user = await User.findById(userId);

            if (!user) {
                const error = new Error('User not found');
                error.statusCode = 404;
                throw error;
            }

            const result = await User.findByIdAndDelete(userId);

            return {
                user: result,
            };
        } catch (err) {
            throw err;
        }
    };

    getUser = async (userId) => {
        try {
            const user = await User.findById(userId);

            if (!user) {
                const error = new Error('User not found');
                error.statusCode = 404;
                throw error;
            }

            return {
                user: user,
            };
        } catch (err) {
            throw err;
        }
    };

    getUsers = async (userReq) => {
        const currentPage = +userReq.pageNum || 1;
        const perPage = +userReq.perPage || 5;
        const status = userReq.status;

        let filter = {};
        if (status) {
            filter = { status: status };
        }

        try {
            const users = await User.find(filter)
                .skip((currentPage - 1) * perPage)
                .limit(perPage);

            if (!users) {
                return undefined;
            }

            return {
                users: users,
            };
        } catch (err) {
            throw err;
        }
    };
    
    markUserAsVerified = async (userId) => {
        try {
            const user = await User.findByIdAndUpdate(userId, {
              $set: { isVerified: true },
              $unset: { verificationToken: "", verificationTokenExpires: "" } // Clears the verification token and expiration
            }, { new: true });
    
            return user;
        } catch (error) {
            console.error("Error marking user as verified:", error);
            throw error;
        }
    };

    resendVerification = async (user) => {
        if (!user) {
            const error = new Error("A valid user is required.");
            error.statusCode = 400;
            throw error;
        }
        try {
            const existingUser = await this.findUserByEmail(user.email);
            
            if (!existingUser) {
                const error = new Error("User not found");
                error.statusCode = 404;
                throw error;
            }
    
            await existingUser.save();

            return existingUser;
        }
        catch (error) {
            throw err;
        }
    };

    getByCredentials = async (userReq) => {
        try {
            const user = await User.findByCredentials(
                userReq.email,
                userReq.password
            );
    
            if (!user) {
                const error = new Error('User not found');
                error.statusCode = 404;
                throw error;
            }
    
            if (!user.isVerified) {
                const error = new Error('Email not verified');
                error.statusCode = 403;
                throw error;
            }
    
            const token = await user.generateAuthToken();
    
            return {
                user: user,
                token: token,
            };
        } catch (err) {
            throw err;
        }
    };

    findUserByVerificationToken = async (token) => {
        try {
            return await User.findOne({
              verificationToken: token,
              verificationTokenExpires: { $gt: Date.now() }, // Ensures token hasn't expired
            });
        } catch (err) {
            console.error('Error finding user by verification token:', err);
            throw err;
        }
    };
    
    findUserByEmail = async (email) => {
        try {
            const userFound = await User.findOne({ email });
            return userFound;
        } catch (err) {
            console.error('Error finding user by email:', err);
            throw err;
        }
    };
        
}