import { FilterQuery } from 'mongodb';
import { Game } from '../models/game';

export interface CreateGameDto {
  title: string;
  description: string;
  playerIds: string[];
  pictures: string[];
}

export interface UpdateGameDto extends CreateGameDto {
  id: string;
}
export interface GameGetDto {
    limit?: number;
    pageNumber?: number;
    filter?: FilterQuery<Partial<Game>>;
    path: string;
  }
  