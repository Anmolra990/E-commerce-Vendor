import bcrypt from "bcrypt";
import authRepository from "./auth.repository.js";
import generateToken from "../../utils/generateToken.js";
import AppError from "../../utils/AppError.js";

class AuthService {
  async register(userData) {
    const { name, email, password, role } = userData;

    const existingUser = await authRepository.findUserByEmail(email);

    if (existingUser) {
      throw new AppError("Email already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await authRepository.createUser({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return user;
  }

  async login(email, password) {
    const user = await authRepository.findUserByEmail(email);

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = generateToken(user);

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  async getProfile(user) {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      addresses: user.addresses || [],
    };
  }

  async addAddress(userId, addressData) {
    const user = await authRepository.findUserById(userId);
    const isFirstAddress = user.addresses.length === 0;
    if (addressData.isDefault || isFirstAddress) {
      user.addresses.forEach((address) => { address.isDefault = false; });
    }
    user.addresses.push({ ...addressData, isDefault: addressData.isDefault || isFirstAddress });
    await authRepository.saveUser(user);
    return user.addresses;
  }

  async updateAddress(userId, addressId, addressData) {
    const user = await authRepository.findUserById(userId);
    const address = user.addresses.id(addressId);
    if (!address) throw new AppError("Address not found", 404);

    if (addressData.isDefault) {
      user.addresses.forEach((savedAddress) => { savedAddress.isDefault = false; });
    }
    Object.assign(address, addressData);
    await authRepository.saveUser(user);
    return user.addresses;
  }

  async deleteAddress(userId, addressId) {
    const user = await authRepository.findUserById(userId);
    const address = user.addresses.id(addressId);
    if (!address) throw new AppError("Address not found", 404);

    const wasDefault = address.isDefault;
    user.addresses.pull(addressId);
    if (wasDefault && user.addresses.length) user.addresses[0].isDefault = true;
    await authRepository.saveUser(user);
    return user.addresses;
  }
}

export default new AuthService();
