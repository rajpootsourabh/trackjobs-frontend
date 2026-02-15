// services/api/interceptors/responseInterceptor.js
export const responseInterceptor = (response) => {
  // Calculate request duration for performance monitoring
  const endTime = new Date();
  const startTime = response.config.metadata?.startTime;
  const duration = startTime ? endTime - startTime : 0;

  // Log in development only
  if (process.env.NODE_ENV === "development") {
    console.log(
      `[API] ${response.config.method?.toUpperCase()} ${response.config.url}`,
      `Status: ${response.status}`,
      `Duration: ${duration}ms`,
    );
  }

  // You could send performance data to analytics in production
  if (process.env.NODE_ENV === "production" && duration > 1000) {
    // Report slow API calls to your monitoring service
    // reportSlowApi(response.config.url, duration);
  }

  return response;
};