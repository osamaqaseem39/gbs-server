const { createApp } = require('../dist/main');

let cachedApp;
let appPromise;

module.exports = async (req, res) => {
  const requestStartTime = Date.now();
  
  try {
    // Initialize app only once, but handle concurrent requests during initialization
    if (!appPromise) {
      console.log('🚀 Starting app initialization...');
      appPromise = createApp().catch(err => {
        console.error('❌ App initialization failed:', err);
        appPromise = null; // Reset so we can retry
        throw err;
      });
    }
    
    if (!cachedApp) {
      cachedApp = await appPromise;
      console.log(`✅ App ready after ${Date.now() - requestStartTime}ms`);
    }
    
    const server = cachedApp.getHttpAdapter().getInstance();
    
    // Handle the request with Express
    server(req, res);
  } catch (error) {
    console.error('❌ Error in serverless handler:', error);
    console.error('Stack:', error.stack);
    
    // Send error response if headers haven't been sent
    if (!res.headersSent) {
      res.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
        timestamp: new Date().toISOString()
      });
    }
  }
};
