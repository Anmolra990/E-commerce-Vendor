import Membership from "./membership.model.js";

class MembershipRepository {

  async createMembership(data) {
    return await Membership.create(data);
  }

  async getMembershipById(id) {
    return await Membership.findById(id);
  }

  async getUserMembership(userId) {
    return await Membership.findOne({
    
      status: "Active",
      endDate: {
        $gt: new Date(),
      },
    });
  }

  async updateMembership(id, data) {
    return await Membership.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
      }
    );
  }

}

export default new MembershipRepository();