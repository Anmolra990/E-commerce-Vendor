import Membership from "./membership.model.js";

const membershipController = {

  // ==========================================
  // CREATE MEMBERSHIP
  // POST /api/membership/create
  // ==========================================

  createMembership: async (req, res) => {
    try {

      const userId = req.user.id;
      const { plan } = req.body;

      // Check plan
      if (!plan) {
        return res.status(400).json({
          success: false,
          message: "Membership plan is required",
        });
      }

      // Decide price on backend
      let price;

      if (plan === "silver") {
        price = 499;
      } else if (plan === "gold") {
        price = 999;
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid membership plan",
        });
      }

      // Create membership
      const membership = await Membership.create({
        userId,
        plan,
        price,
        status: "Pending",
        startDate: null,
      });

      return res.status(201).json({
        success: true,
        message: "Membership created",

        data: {
          membership: {
            _id: membership._id,
            userId: membership.userId,
            plan: membership.plan,
            price: membership.price,
            status: membership.status,
            startDate: membership.startDate,
          },
        },
      });

    } catch (error) {

      console.error(
        "CREATE MEMBERSHIP ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to create membership",
      });
    }
  },


  // ==========================================
  // GET MY MEMBERSHIP
  // GET /api/membership/my
  // ==========================================

  getMyMembership: async (req, res) => {
    try {

      const userId = req.user.id;

      const membership =
        await Membership.findOne({
          userId,
        }).sort({
          createdAt: -1,
        });

      if (!membership) {
        return res.status(404).json({
          success: false,
          message: "No membership found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Membership found",
        data: membership,
      });

    } catch (error) {

      console.error(
        "GET MY MEMBERSHIP ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to get membership",
      });
    }
  },


  // ==========================================
  // GET MEMBERSHIP BY ID
  // GET /api/membership/:id
  // ==========================================

  getMembershipById: async (req, res) => {
    try {

      const { id } = req.params;

      const membership =
        await Membership.findById(id);

      if (!membership) {
        return res.status(404).json({
          success: false,
          message: "Membership not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Membership found",
        data: membership,
      });

    } catch (error) {

      console.error(
        "GET MEMBERSHIP BY ID ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to get membership",
      });
    }
  },

};

export default membershipController;