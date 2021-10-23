import { install as installSourceMapSupport } from 'source-map-support';
installSourceMapSupport();
import 'reflect-metadata';
import express from 'express';
import compress from 'compression';
import cors from 'cors';
import errorHandler from './errors/error-handler';
import logger from './logger';
import { GameRoutes, PlayerRoutes } from './routes';
import dotenv from 'dotenv';
import requestCountLogger from './request-count-logger';
import YAML from 'yamljs';
import swaggerUI from 'swagger-ui-express';
dotenv.config();

export default async function createServer() {
  const server = express();

  // Attach HTTP request info logger middleware in test mode
  if (process.env.NODE_ENV === 'test') {
    server.use((req: express.Request, _res, next) => {
      logger.debug(`[${req.method}] ${req.hostname}${req.url}`);

      next();
    });
  }
  server.use(requestCountLogger);
  server.disable('x-powered-by'); // Hide information
  server.use(compress()); // Compress
  // Enable middleware/whatever only in Production
  if (process.env.NODE_ENV === 'production') {
    // For example: Enable sentry in production
    // app.use(Sentry.Handlers.requestHandler());
  }

  /**
   * Configure cors
   */
  server.use(cors());

  /**
   * Configure body parser
   */
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  /**
   * Configure routes
   */
  PlayerRoutes(server);
  GameRoutes(server);

  const swaggerDocument = YAML.load('./openapi.yml');

  server.use(
    '/api-docs',
    swaggerUI.serve,
    swaggerUI.setup(swaggerDocument)
  );

  /**
   * Configure error handler
   */
  errorHandler(server);
  return server;
}
