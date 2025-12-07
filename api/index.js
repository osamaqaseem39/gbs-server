const { createApp } = require('../dist/main');

let cachedApp;

module.exports = async (req, res) => {
  const requestStartTime = Date.now();
  
  try {
    // Get or create the cached app
    if (!cachedApp) {
      console.log('🚀 Creating NestJS app for serverless function...');
      cachedApp = await createApp();
      console.log(`✅ App ready after ${Date.now() - requestStartTime}ms`);
    }
    
    // Use NestJS HTTP adapter to handle the request
    const httpAdapter = cachedApp.getHttpAdapter();
    const instance = httpAdapter.getInstance();
    
    // Wrap in Promise to ensure we wait for response
    return new Promise((resolve) => {
      let resolved = false;
      
      // Set timeout to prevent hanging (55 seconds to be safe)
      const timeout = setTimeout(() => {
        if (!resolved && !res.headersSent) {
          console.error('⚠️ Request timeout after 55s');
          resolved = true;
          res.status(504).json({
            statusCode: 504,
            message: 'Gateway Timeout',
            error: 'Request timeout'
          });
          resolve();
        }
      }, 55000);
      
      // Handle response completion
      const cleanup = () => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeout);
          resolve();
        }
      };
      
      // Listen for response events
      res.once('finish', cleanup);
      res.once('close', cleanup);
      res.once('error', (err) => {
        console.error('Response error:', err);
        cleanup();
      });
      
      // Process the request
      try {
        instance(req, res, (err) => {
          if (err) {
            console.error('Express error:', err);
            if (!resolved && !res.headersSent) {
              res.status(500).json({
                statusCode: 500,
                message: 'Internal server error',
                error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
              });
            }
          }
          cleanup();
        });
      } catch (err) {
        console.error('Error processing request:', err);
        cleanup();
        if (!res.headersSent) {
          res.status(500).json({
            statusCode: 500,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
          });
        }
      }
    });
  } catch (error) {
    console.error('❌ Error in serverless handler:', error);
    console.error('Stack:', error.stack);
    
    if (!res.headersSent) {
      res.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
};

