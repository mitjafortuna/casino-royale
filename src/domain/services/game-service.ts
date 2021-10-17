import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { FilterQuery } from 'mongodb';
import { Game } from '../models/game';
import { IGameService } from './interfaces/game-service';
import { IGameRepository } from '../models/interfaces/game-repository';
import { CreateGameDTO, UpdateGameDTO } from '../dto/game-dtos';
import { Pagination } from '../../utils/pagination';
import { paginate } from '../../utils/paginate';

@injectable()
export class GameService implements IGameService {
  constructor(
    @inject(TYPES.IGameRepository) private repository: IGameRepository
  ) {}

  public async listAllGames(): Promise<Game[]> {
    return await this.repository.find({});
  }

  public async listAllGamesWithPagination(
    limit: number,
    pageNumber: number,
    path: string
  ): Promise<Pagination<Game>> {
    const games = await this.repository.find({}, limit, pageNumber);
    return paginate(games, limit, pageNumber, path);
  }

  public async searchGames(
    filter: FilterQuery<Partial<Game>>
  ): Promise<Game[]> {
    return await this.repository.find(filter);
  }
  public async createGame(dto: CreateGameDTO): Promise<Game> {
    return await this.repository.create(dto);
  }
  public async getGame(id: string): Promise<Game> {
    return await this.repository.get(id);
  }
  public async updateGame(dto: UpdateGameDTO): Promise<void> {
    return await this.repository.updateById(dto.id, dto);
  }
  public async deleteGame(id: string): Promise<void> {
    return await this.repository.removeById(id);
  }
}
