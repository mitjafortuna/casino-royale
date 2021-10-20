import { MongoClient, Db, Collection } from 'mongodb';
import logger from './logger';
import { MongoMemoryServer } from 'mongodb-memory-server';

/**
 * All the methods and properties mentioned in the following class is
 * specific to MongoDB. You should make necessary changes to support
 * the database you want to use.
 */

class Database {
  private password: string;
  private user: string;
  private host: string;
  private dbName: string;

  private dbClient: MongoClient | undefined;
  private databaseInstance: Db | undefined;
  private mongoServer?: MongoMemoryServer;

  constructor() {
    this.password = process.env.DB_PWD ?? '';
    this.user = process.env.DB_USER ?? '';
    this.host = process.env.DB_HOST ?? 'localhost:27017';
    this.dbName = process.env.DB_NAME ?? 'casino-royale';
  }

  public async connect(): Promise<void> {
    if (this.dbClient) {
      logger.debug('Connection already exists');
      return;
    }

    const TWO_MINUTES_IN_MS = 2 * 60 * 1000;
    const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

    const connectionString = await this.getConnectionString();

    logger.debug(`Database connection string: ${connectionString}`);

    const client = new MongoClient(connectionString, {
      poolSize: 50,
      connectTimeoutMS: TWO_MINUTES_IN_MS,
      socketTimeoutMS: ONE_DAY_IN_MS,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    this.dbClient = await client.connect();
    logger.info('Connected with database host');

    this.databaseInstance = this.dbClient.db(this.dbName);
  }

  public async disconnect() {
    if (this.dbClient?.isConnected()) {
      logger.info(`Disconnected from ${this.host}/${this.dbName}`);
      await this.dbClient.close();
      if (process.env.NODE_ENV === 'test') {
        logger.info('Stopped memory server');
        await this.mongoServer?.stop();
      }
    }
  }

  /**
   * For MongoDB there is no table. It is called collection
   * If you are using SQL database then this should be something like getTable()
   *
   * @param name MongoDB Collection name
   */
  public getCollection(name: string): Collection {
    if (!this.databaseInstance) {
      throw new Error('Database not initialized');
    }

    return this.databaseInstance.collection(name);
  }

  /**
   * Build database connection string.
   * Customize as needed for your database.
   */
  private async getConnectionString() {
    if (process.env.NODE_ENV === 'test') {
      this.mongoServer = await MongoMemoryServer.create();
      logger.info('Started memory server');
      return this.mongoServer.getUri();
    }

    if (process.env.NODE_ENV !== 'localhost' && this.user && this.password) {
      return `mongodb://${this.user}:${this.password}@${this.host}/${this.dbName}`;
    }

    return `mongodb://${this.host}/${this.dbName}`;
  }

  public getDbHost() {
    return this.host;
  }

  public getDbPassword() {
    return this.password;
  }

  public getDbUser() {
    return this.user;
  }

  public getDbName() {
    return this.dbName;
  }

  public isDbConnected() {
    return this.dbClient && this.dbClient.isConnected();
  }
}

const db = new Database();

export default db;
