import { injectable} from 'inversify';
import { IPlayerRepository } from '../../domain/models/interfaces/player-repository';
import { Select, Sort } from '../../domain/models/interfaces/repository';
import { Player } from '../../domain/models/player';
import { FilterQuery, Collection } from 'mongodb';

@injectable()
export class PlayerRepository implements IPlayerRepository{
    get(id: any, select?: Select): Promise<Player> {
        throw new Error('Method not implemented.');
    }
    find(filter: FilterQuery<Player>, limit?: number, page?: number, select?: Select, sort?: Sort): Promise<Player[]> {
        throw new Error('Method not implemented.');
    }
    create(data: Partial<Player>): Promise<Player> {
        throw new Error('Method not implemented.');
    }
    createMany(data: (Player | undefined)[]): Promise<Player[]> {
        throw new Error('Method not implemented.');
    }
    update(filter: FilterQuery<Player>, data: Partial<Player>, multi: boolean): Promise<void> {
        throw new Error('Method not implemented.');
    }
    updateById(ids: any, data: Partial<Player>): Promise<void> {
        throw new Error('Method not implemented.');
    }
    remove(filter: FilterQuery<Player>, multi: boolean): Promise<void> {
        throw new Error('Method not implemented.');
    }
    removeById(id: any): Promise<void> {
        throw new Error('Method not implemented.');
    }
    getCollection(): Collection<any> {
        throw new Error('Method not implemented.');
    }

}