import User from "./auth.model.js";

class AuthRepository {
  
  async createUser(userData) {
    return await User.create(userData);
  }

 
  async findUserByEmail(email) {
    return await User.findOne({ email });
  }

  async findUserById(id) {
    return await User.findById(id);
  }

  async saveUser(user) {
    return await user.save();
  }
}

export default new AuthRepository();
