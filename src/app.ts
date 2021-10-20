import createServer from './infrastructure/server';
import initDB from './infrastructure/database';
import logger from './infrastructure/logger';

(async () => {
  try {
    if (!initDB.isDbConnected()) {
      await initDB.connect();
    }
    const app = await createServer();
    /**
     * Setup listener port
     */
    const PORT = process.env.PORT ?? 4000;
    app.listen(PORT, () => {
      logger.info(`Running Node.js version ${process.version}`);
      logger.info(`App environment: ${process.env.NODE_ENV}`);
      logger.info(`App is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Unknown error. ' + error);
  }
})();
