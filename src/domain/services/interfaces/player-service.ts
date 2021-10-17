import { Player } from '../../models/player';

export interface IPlayerService {
    listAllActors(): Promise<Player[]>;
}