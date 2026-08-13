const authorize = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access Denied for role: ${userRole || "unknown"}`,
      });
    }

    next();
  };
};

export default authorize;