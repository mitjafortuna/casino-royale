import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { IPlayerService } from './interfaces/player-service';
import { Player } from '../models/player';
import { IRepository } from '../models/interfaces/repository';

@injectable()
export class PlayerService implements IPlayerService {
  public constructor(
    @inject(TYPES.IPlayerRepository) private repository: IRepository<Player>
  ) {}

  public async listAllActors(): Promise<Player[]> {
      return await this.repository.find({});
  }
}
