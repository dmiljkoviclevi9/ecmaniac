export default class UserService {
    constructor({ userRepository }) {
        this.userRepository = userRepository;
    }

    createUser = async (userData) => {
        try {
            return await this.userRepository.createUser(userData);
        } catch (err) {
            throw err;
        }
    };

    patchUser = async (userData) => {
        try {
            return await this.userRepository.patchUser(userData);
        } catch (err) {
            throw err;
        }
    };

    updateUser = async (userData) => {
        try {
            return await this.userRepository.updateUser(userData);
        } catch (err) {
            throw err;
        }
    };

    deleteUser = async (userId) => {
        try {
            return await this.userRepository.deleteUser(userId);
        } catch (err) {
            throw err;
        }
    };

    getUser = async (userId) => {
        try {
            return await this.userRepository.getUser(userId);
        } catch (err) {
            throw err;
        }
    };

    getUsers = async (userReq) => {
        try {
            return await this.userRepository.getUsers(userReq);
        } catch (err) {
            throw err;
        }
    };

    getByCredentials = async (userReq) => {
        try {
            return await this.userRepository.getByCredentials(userReq);
        } catch (err) {
            throw err;
        }
    };

    verifyUser = async (token) => {
        const user = await this.userRepository.findUserByVerificationToken(token);
        if (!user) {
          throw new Error("User not found or token is invalid or has expired.");
        }
    
        return await this.userRepository.markUserAsVerified(user._id);
    };

    resendVerification = async (user) => {
        try {
            return await this.userRepository.resendVerification(user);
        } catch (err) {
            throw err;
        }
    };
}