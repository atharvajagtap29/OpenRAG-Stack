// Healthcheck API controller
export const healthCheck = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "✅ Server is healthy",
    timestamp: new Date().toISOString(),
  });
};
