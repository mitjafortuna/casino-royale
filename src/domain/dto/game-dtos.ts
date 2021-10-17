import { Player } from '../models/player';

export interface UpdateGameDTO {
    id: string;
    title: string;
    description: string;
    players: Player[];
    pictures: string[];
}

export interface CreateGameDTO {
    title: string;
    description: string;
    players: Player[];
    pictures: string[];
}
