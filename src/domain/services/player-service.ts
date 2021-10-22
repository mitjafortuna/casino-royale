import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { IPlayerService } from './interfaces/player-service';
import { Player } from '../models/player';
import { IRepository } from '../models/interfaces/repository';
import {
  GamesPlayedByPlayerDto,
  PlayerDto,
  PlayerGetDto,
  UpdatePlayerDto,
} from '../dto/player-dtos';
import { NotFoundError } from '../../infrastructure/errors/app-errors';
import { Pagination } from '../../utils/pagination';
import { paginate } from '../../utils/paginate';
import { Game } from '../models/game';

@injectable()
export class PlayerService implements IPlayerService {
  public constructor(
    @inject(TYPES.IPlayerRepository)
    private playerRepository: IRepository<Player>,
    @inject(TYPES.IGameRepository) private gameRepository: IRepository<Game>
  ) {}
  public async getAllPlayers(
    getPlayerDto: PlayerGetDto
  ): Promise<Pagination<Player> | Player[]> {
    const players = await this.playerRepository.find(
      getPlayerDto.filter ?? {},
      getPlayerDto.limit,
      getPlayerDto.pageNumber
    );
    return paginate(
      players,
      getPlayerDto.path,
      getPlayerDto.limit,
      getPlayerDto.pageNumber
    );
  }
  public async getAllGamesPlayedByPlayer(
    gamesPlayedByPlayerDto: GamesPlayedByPlayerDto
  ): Promise<Pagination<Game> | Game[]> {
    const player = await this.playerRepository.get(gamesPlayedByPlayerDto.playerId);
    if (player === null) {
      throw new NotFoundError(`Player with id ${gamesPlayedByPlayerDto.playerId} was not found`);
    }    
    const players = await this.gameRepository.find(
      { playerIds: gamesPlayedByPlayerDto.playerId },
      gamesPlayedByPlayerDto.limit,
      gamesPlayedByPlayerDto.pageNumber
    );
    return paginate(
      players,
      gamesPlayedByPlayerDto.path,
      gamesPlayedByPlayerDto.limit,
      gamesPlayedByPlayerDto.pageNumber
    );
  }
  public async createPlayer(dto: PlayerDto): Promise<Player> {
    return await this.playerRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      birthDate: dto.birthDate,
    });
  }
  public async getPlayer(id: string): Promise<Player> {
    const player = await this.playerRepository.get(id);
    if (player === null) {
      throw new NotFoundError(`Player with id ${id} was not found`);
    }
    return player;
  }
  public async updatePlayer(dto: UpdatePlayerDto): Promise<void> {
    return await this.playerRepository.updateById(dto.id, dto);
  }
  public async deletePlayer(id: string): Promise<void> {
    return await this.playerRepository.removeById(id);
  }
}
