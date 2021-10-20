import { CreateGameDto, GameGetDto, UpdateGameDto } from '../../dto/game-dtos';
import { Game } from '../../models/game';
import { Pagination } from '../../../utils/pagination';
import { FilterQuery } from 'mongodb';

export interface IGameService {
  getAllGames(getGameDto: GameGetDto): Promise<Pagination<Game> | Game[]>;
  searchGames(filter: FilterQuery<Partial<Game>>): Promise<Game[]>;
  createGame(dto: CreateGameDto): Promise<Game>;
  getGame(id: string): Promise<Game>;
  updateGame(dto: UpdateGameDto): Promise<void>;
  deleteGame(id: string): Promise<void>;
}
