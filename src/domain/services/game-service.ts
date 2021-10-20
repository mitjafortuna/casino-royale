import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { FilterQuery } from 'mongodb';
import { Game } from '../models/game';
import { IGameService } from './interfaces/game-service';
import { CreateGameDto, GameGetDto, UpdateGameDto } from '../dto/game-dtos';
import { Pagination } from '../../utils/pagination';
import { paginate } from '../../utils/paginate';
import { IRepository } from '../models/interfaces/repository';
import { NotFoundError } from '../../infrastructure/errors/app-errors';

@injectable()
export class GameService implements IGameService {
  constructor(
    @inject(TYPES.IGameRepository) private repository: IRepository<Game>
  ) {}

  public async getAllGames(
    getGameDto: GameGetDto
  ): Promise<Pagination<Game> | Game[]> {
    const games = await this.repository.find(
      getGameDto.filter ?? {},
      getGameDto.limit,
      getGameDto.pageNumber
    );

    return paginate(
      games,
      getGameDto.path,
      getGameDto.limit,
      getGameDto.pageNumber
    );
  }

  public async searchGames(
    filter: FilterQuery<Partial<Game>>
  ): Promise<Game[]> {
    return await this.repository.find(filter);
  }
  public async createGame(dto: CreateGameDto): Promise<Game> {
    return await this.repository.create(dto);
  }
  public async getGame(_id: string): Promise<Game> {
    const game = await this.repository.get(_id);
    if (game === null) {
      throw new NotFoundError(`Game with id ${_id} was not found`);
    }
    return game;
  }
  public async updateGame(dto: UpdateGameDto): Promise<void> {
    return await this.repository.updateById(dto.id, dto);
  }
  public async deleteGame(id: string): Promise<void> {
    return await this.repository.removeById(id);
  }
}
