import { injectable } from 'inversify';
import { IRepository } from '../../domain/models/interfaces/repository';
import { Game } from '../../domain/models/game';
import Repository from './repository';

@injectable()
export class GameRepository
  extends Repository<Game>
  implements IRepository<Game>
{
  constructor() {
    super('game'); // Passing collection name
  }
}
