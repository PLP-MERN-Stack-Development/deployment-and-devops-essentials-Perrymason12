// Monitoring middleware for production
const monitoring = {
  // Request metrics
  requestCount: 0,
  errorCount: 0,
  startTime: Date.now(),

  // Track request
  trackRequest: (req, res, next) => {
    monitoring.requestCount++;
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      if (res.statusCode >= 400) {
        monitoring.errorCount++;
      }
      
      // Log slow requests in production
      if (process.env.NODE_ENV === 'production' && duration > 1000) {
        console.warn(`Slow request: ${req.method} ${req.path} took ${duration}ms`);
      }
    });
    
    next();
  },

  // Get metrics
  getMetrics: () => {
    const uptime = Date.now() - monitoring.startTime;
    return {
      uptime: Math.floor(uptime / 1000), // in seconds
      requests: monitoring.requestCount,
      errors: monitoring.errorCount,
      errorRate: monitoring.requestCount > 0 
        ? (monitoring.errorCount / monitoring.requestCount * 100).toFixed(2) 
        : 0,
      memory: process.memoryUsage(),
    };
  },

  // Reset metrics (useful for testing)
  reset: () => {
    monitoring.requestCount = 0;
    monitoring.errorCount = 0;
    monitoring.startTime = Date.now();
  },
};

module.exports = monitoring;


