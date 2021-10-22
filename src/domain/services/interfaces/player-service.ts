import { Pagination } from '../../../utils/pagination';
import { GamesPlayedByPlayerDto, PlayerDto, PlayerGetDto, UpdatePlayerDto } from '../../dto/player-dtos';
import { Game } from '../../models/game';
import { Player } from '../../models/player';

export interface IPlayerService {
  getAllPlayers(
    getPlayerDto: PlayerGetDto
  ): Promise<Pagination<Player> | Player[]>;
  getAllGamesPlayedByPlayer(
    getPlayerDto: GamesPlayedByPlayerDto
  ): Promise<Pagination<Game> | Game[]>
  createPlayer(dto: PlayerDto): Promise<Player>;
  getPlayer(id: string): Promise<Player>;
  updatePlayer(dto: UpdatePlayerDto): Promise<void>;
  deletePlayer(id: string): Promise<void>;
}
