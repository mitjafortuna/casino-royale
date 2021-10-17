import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { IPlayerService } from './interfaces/player-service';
import { IPlayerRepository } from '../models/interfaces/player-repository';
import { Player } from '../models/player';

@injectable()
export class PlayerService implements IPlayerService {
  public constructor(
    @inject(TYPES.IPlayerRepository) private repository: IPlayerRepository
  ) {}

  public async listAllActors(): Promise<Player[]> {
      return await this.repository.find({});
  }
}
