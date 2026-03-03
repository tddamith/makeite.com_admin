const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api/anthropic",
    createProxyMiddleware({
      target: "https://api.anthropic.com",
      changeOrigin: true,
      pathRewrite: { "^/api/anthropic": "" },
      on: {
        proxyReq: (proxyReq) => {
          proxyReq.setHeader(
            "x-api-key",
            process.env.REACT_APP_ANTHROPIC_API_KEY || "",
          );
          proxyReq.setHeader("anthropic-version", "2023-06-01");
          // Remove the origin/referer headers that can cause issues
          proxyReq.removeHeader("origin");
          proxyReq.removeHeader("referer");
        },
      },
    }),
  );
};
