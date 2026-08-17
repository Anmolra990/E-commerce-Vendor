const validateWithZod = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const containsUnsupportedField = result.error.issues.some(
      (issue) => issue.code === "unrecognized_keys"
    );

    return res.status(400).json({
      success: false,
      message: containsUnsupportedField
        ? "Only your name can be updated. Email cannot be changed."
        : result.error.issues[0]?.message || "Invalid request data",
      errors: result.error.issues,
    });
  }

  req.validatedBody = result.data;
  next();
};

export default validateWithZod;
