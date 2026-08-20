import membershipRepository from "./membership.repository.js";
import AppError from "../../utils/AppError.js";

class MembershipService {

  async createMembership(userId, plan) {

    const plans = {
      silver: {
        price: 499,
      },

      gold: {
        price: 999,
      },
    };

    const selectedPlan = plans[plan];

    if (!selectedPlan) {
      throw new AppError(
        "Invalid membership plan",
        400
      );
    }

    // Check existing active membership
    const existing =
      await membershipRepository.getUserMembership(
        userId
      );

    if (existing) {
      throw new AppError(
        "You already have an active membership",
        400
      );
    }

    // Create pending membership
    const membership =
      await membershipRepository.createMembership({
        userId,
        plan,
        price: selectedPlan.price,
        status: "Pending",
      });

    return membership;
  }


  async getMyMembership(userId) {

    return await membershipRepository
      .getUserMembership(userId);
  }


  async getMembershipById(id) {

    const membership =
      await membershipRepository
        .getMembershipById(id);

    if (!membership) {
      throw new AppError(
        "Membership not found",
        404
      );
    }

    return membership;
  }

}

export default new MembershipService();