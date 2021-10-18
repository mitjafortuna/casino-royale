import { injectable } from 'inversify';
import { IRepository } from '../../domain/models/interfaces/repository';
import { Player } from '../../domain/models/player';
import Repository from './repository';

@injectable()
export class PlayerRepository
  extends Repository<Player>
  implements IRepository<Player> {
    constructor() {
        super('player'); // Passing collection name
      }
  }
