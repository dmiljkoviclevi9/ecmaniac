export default class AuthController {
    constructor({ userService }) {
      this.userService = userService;
    }
  
    logIn = async (req, res) => {
      const { email, password } = req.body;
  
      try {
        const result = await this.userService.getByCredentials({
          email,
          password,
        });
  
        if (!result) {
          return res.status(401).json({ message: "Unable to login!" });
        }
  
        res.status(200).json({
          message: "User logged in successfully!",
          user: result.user,
          token: result.token,
        });
      } catch (e) {
        throw e;
      }
    };
  
    logOut = async (req, res) => {
      try {
        req.user.tokens = req.user.tokens.filter((token) => {
          return token.token !== req.token;
        });
        await req.user.save();
  
        res.status(200).json({
          message: "User logged out successfully!",
        });
      } catch (e) {
        throw e;
      }
    };
  }