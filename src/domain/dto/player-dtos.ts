import { FilterQuery } from 'mongodb';
import { Player } from '../models/player';

export interface PlayerDto {
  firstName: string;
  lastName: string;
  movies: string[];
}

export interface UpdatePlayerDto extends PlayerDto {
  id: string;
}

export interface PlayerGetDto {
  limit?: number;
  pageNumber?: number;
  filter?: FilterQuery<Partial<Player>>;
  path: string;
}
