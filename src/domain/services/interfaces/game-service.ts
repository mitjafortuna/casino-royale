import {
  CreateGameDTO,
  UpdateGameDTO,
} from '../../dto/game-dtos';
import { Game } from '../../models/game';
import { Pagination } from '../../../utils/pagination';
import { FilterQuery } from 'mongodb';

export interface IGameService {
  listAllGames(): Promise<Game[]>;
  listAllGamesWithPagination(
    limit: number,
    pageNumber: number,
    path: string
  ): Promise<Pagination<Game>>;
  searchGames(filter: FilterQuery<Partial<Game>>): Promise<Game[]>;
  createGame(dto: CreateGameDTO): Promise<Game>;
  getGame(id: string): Promise<Game>;
  updateGame(dto: UpdateGameDTO): Promise<void>;
  deleteGame(id: string): Promise<void>;
}
