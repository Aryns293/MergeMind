
/**
 * Generic Zod validation middleware factory.
 * Accepts a Zod schema and returns Express middleware that validates req.body.
 * If validation fails, a structured 400 error is returned immediately.
 */
const validate = (schema) => (req, res, next) => {
  // Check if schema expects a full request object (body, query, params)
  const isFullRequestSchema = schema.shape && (schema.shape.body || schema.shape.query || schema.shape.params);

  const dataToValidate = isFullRequestSchema
    ? { body: req.body, query: req.query, params: req.params }
    : req.body;

  const result = schema.safeParse(dataToValidate);

  if (!result.success) {
    const errors = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors,
    });
  }

  // Replace req properties with parsed/transformed data
  if (isFullRequestSchema) {
    if (result.data.body) req.body = result.data.body;
    if (result.data.query) req.query = result.data.query;
    if (result.data.params) req.params = result.data.params;
  } else {
    req.body = result.data;
  }

  next();
};

export default validate;
