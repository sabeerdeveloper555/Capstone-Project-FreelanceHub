import 'dotenv/config';


import app from './src/app.js';
import { connectDB, disconnectDB } from './src/config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to Database and start server
const startServer = async () => {
  try {
    // Attempt database connection
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`🚀 FreelanceHub PK Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    });

    // Graceful Shutdown logic
    const handleShutdown = async (signal) => {
      console.log(`\n🛑 Received ${signal}. Initiating graceful shutdown...`);
      server.close(async () => {
        console.log('🔌 HTTP server closed.');
        await disconnectDB();
        console.log('✨ FreelanceHub PK backend exited cleanly.');
        process.exit(0);
      });

      // Force exit after 10s if connections fail to close
      setTimeout(() => {
        console.error('⚠️ Forced shutdown due to timeout.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGINT', () => handleShutdown('SIGINT'));
    process.on('SIGTERM', () => handleShutdown('SIGTERM'));

    // Handle Unhandled Rejections and Uncaught Exceptions
    process.on('unhandledRejection', (reason) => {
      console.error('💥 Unhandled Rejection:', reason);
    });

    process.on('uncaughtException', (error) => {
      console.error('💥 Uncaught Exception:', error);
      process.exit(1);
    });

  } catch (error) {
    console.error(`❌ Fatal startup error: ${error.message}`);
    process.exit(1);
  }
};

startServer();

