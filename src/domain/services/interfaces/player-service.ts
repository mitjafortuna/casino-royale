import { Pagination } from '../../../utils/pagination';
import { PlayerDto, PlayerGetDto, UpdatePlayerDto } from '../../dto/player-dtos';
import { Player } from '../../models/player';

export interface IPlayerService {
  getAllPlayers(
    getPlayerDto: PlayerGetDto
  ): Promise<Pagination<Player> | Player[]>;
  createPlayer(dto: PlayerDto): Promise<Player>;
  getPlayer(id: string): Promise<Player>;
  updatePlayer(dto: UpdatePlayerDto): Promise<void>;
  deletePlayer(id: string): Promise<void>;
}
