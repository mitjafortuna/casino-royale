import { CreateGameDto, GameGetDto, UpdateGameDto } from '../../dto/game-dtos';
import { Game, GameWithEnrichedPlayers } from '../../models/game';
import { Pagination } from '../../../utils/pagination';
import { FilterQuery } from 'mongodb';

export interface IGameService {
  getAllGames(getGameDto: GameGetDto): Promise<Pagination<GameWithEnrichedPlayers> | GameWithEnrichedPlayers[]>;
  searchGames(filter: FilterQuery<Partial<Game>>): Promise<GameWithEnrichedPlayers[]>;
  createGame(dto: CreateGameDto): Promise<GameWithEnrichedPlayers>;
  getGame(id: string): Promise<GameWithEnrichedPlayers>;
  updateGame(dto: UpdateGameDto): Promise<void>;
  deleteGame(id: string): Promise<void>;
}
