import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { FilterQuery } from 'mongodb';
import { Game } from '../models/game';
import { IGameService } from './interfaces/game-service';
import { CreateGameDTO, UpdateGameDTO } from '../dto/game-dtos';
import { Pagination } from '../../utils/pagination';
import { paginate } from '../../utils/paginate';
import { IRepository } from '../models/interfaces/repository';
import { NotFoundError } from '../../infrastructure/errors/app-errors';

@injectable()
export class GameService implements IGameService {
  constructor(
    @inject(TYPES.IGameRepository) private repository: IRepository<Game>
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
    const game = await this.repository.get(id);
    if (game === null) {
      throw new NotFoundError(`Game with id ${id} was not found.`);
    }
    return game;
  }
  public async updateGame(dto: UpdateGameDTO): Promise<void> {
    return await this.repository.updateById(dto.id, dto);
  }
  public async deleteGame(id: string): Promise<void> {
    return await this.repository.removeById(id);
  }
}