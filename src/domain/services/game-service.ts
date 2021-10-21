import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { FilterQuery } from 'mongodb';
import { Game, GameWithEnrichedPlayers } from '../models/game';
import { IGameService } from './interfaces/game-service';
import { CreateGameDto, GameGetDto, UpdateGameDto } from '../dto/game-dtos';
import { Pagination } from '../../utils/pagination';
import { paginate } from '../../utils/paginate';
import { IRepository } from '../models/interfaces/repository';
import { NotFoundError } from '../../infrastructure/errors/app-errors';
import { Player } from '../models/player';

@injectable()
export class GameService implements IGameService {
  constructor(
    @inject(TYPES.IGameRepository) private gameRepository: IRepository<Game>,
    @inject(TYPES.IPlayerRepository)
    private playerRepository: IRepository<Player>
  ) {}

  public async getAllGames(
    getGameDto: GameGetDto
  ): Promise<Pagination<GameWithEnrichedPlayers> | GameWithEnrichedPlayers[]> {
    const games = await this.gameRepository.find(
      getGameDto.filter ?? {},
      getGameDto.limit,
      getGameDto.pageNumber
    );
    const enrichedGames = await this.enrichGames(games);

    return paginate(
      enrichedGames,
      getGameDto.path,
      getGameDto.limit,
      getGameDto.pageNumber
    );
  }
  public async searchGames(
    filter: FilterQuery<Partial<Game>>
  ): Promise<GameWithEnrichedPlayers[]> {
    return await this.enrichGames(await this.gameRepository.find(filter));
  }
  public async createGame(
    dto: CreateGameDto
  ): Promise<GameWithEnrichedPlayers> {
    if (dto.playerIds) {
      await this.checkIfAllPlayersExists(dto.playerIds);
    }

    return await this.enrichGame(await this.gameRepository.create(dto));
  }
  private async checkIfAllPlayersExists(playerIds: string[]) {
    for (const playerId of playerIds) {
      if ((await this.playerRepository.get(playerId)) === null) {
        throw new NotFoundError(`Player with id ${playerId} not found.`);
      }
    }
  }

  public async getGame(_id: string): Promise<GameWithEnrichedPlayers> {
    const game = await this.gameRepository.get(_id);
    if (game === null) {
      throw new NotFoundError(`Game with id ${_id} was not found`);
    }
    return await this.enrichGame(game);
  }
  public async updateGame(dto: UpdateGameDto): Promise<void> {
    if (dto.playerIds) {
      await this.checkIfAllPlayersExists(dto.playerIds);
    }
    return await this.gameRepository.updateById(dto.id, dto);
  }
  public async deleteGame(id: string): Promise<void> {
    return await this.gameRepository.removeById(id);
  }
  private async enrichGames(games: Game[]): Promise<GameWithEnrichedPlayers[]> {
    return await Promise.all(
      games.map(async (g: Game) => {
        return await this.enrichGame(g);
      })
    );
  }
  private async enrichGame(game: Game) {
    return new GameWithEnrichedPlayers(
      game._id,
      game.title,
      game.description,
      game.playerIds,
      game.pictures,
      await Promise.all(
        game.playerIds.map(
          async (playerId: string) => await this.playerRepository.get(playerId)
        )
      )
    );
  }
}
