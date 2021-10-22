import { FilterQuery } from 'mongodb';
import { Player } from '../models/player';

export interface PlayerDto {
  firstName: string;
  lastName: string;
  birthDate: Date;
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

export interface GamesPlayedByPlayerDto {
  playerId: string;
  limit?: number;
  pageNumber?: number;
  path: string;
}
