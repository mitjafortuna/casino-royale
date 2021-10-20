import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { IPlayerService } from './interfaces/player-service';
import { Player } from '../models/player';
import { IRepository } from '../models/interfaces/repository';
import { PlayerDto, PlayerGetDto, UpdatePlayerDto } from '../dto/player-dtos';
import { NotFoundError } from '../../infrastructure/errors/app-errors';
import { Pagination } from '../../utils/pagination';
import { paginate } from '../../utils/paginate';

@injectable()
export class PlayerService implements IPlayerService {
  public constructor(
    @inject(TYPES.IPlayerRepository) private repository: IRepository<Player>
  ) {}
  public async getAllPlayers(
    getPlayerDto: PlayerGetDto
  ): Promise<Pagination<Player> | Player[]> {
    const players = await this.repository.find(
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
  public async createPlayer(dto: PlayerDto): Promise<Player> {
    return await this.repository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      movies: dto.movies,
    });
  }
  public async getPlayer(id: string): Promise<Player> {
    const player = await this.repository.get(id);
    if (player === null) {
      throw new NotFoundError(`Player with id ${id} was not found`);
    }
    return player;
  }
  public async updatePlayer(dto: UpdatePlayerDto): Promise<void> {
    return await this.repository.updateById(dto.id, dto);
  }
  public async deletePlayer(id: string): Promise<void> {
    return await this.repository.removeById(id);
  }
}
