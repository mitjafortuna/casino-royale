import { FilterQuery } from 'mongodb';
import { Game } from '../models/game';
import { Player } from '../models/player';

export interface CreateGameDto {
  title: string;
  description: string;
  players: Player[];
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
  