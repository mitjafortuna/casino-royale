import { injectable } from 'inversify';
import { IGameRepository } from '../../domain/models/interfaces/game-repository';
import { Select, Sort } from '../../domain/models/interfaces/repository';
import { Game } from '../../domain/models/game';
import { FilterQuery, Collection } from 'mongodb';

@injectable()
export class GameRepository implements IGameRepository {
    get(id: any, select?: Select): Promise<Game> {
        throw new Error('Method not implemented.');
    }
    find(filter: FilterQuery<Game>, limit?: number, page?: number, select?: Select, sort?: Sort): Promise<Game[]> {
        throw new Error('Method not implemented.');
    }
    create(data: Partial<Game>): Promise<Game> {
        throw new Error('Method not implemented.');
    }
    createMany(data: (Game | undefined)[]): Promise<Game[]> {
        throw new Error('Method not implemented.');
    }
    update(filter: FilterQuery<Game>, data: Partial<Game>, multi: boolean): Promise<void> {
        throw new Error('Method not implemented.');
    }
    updateById(ids: any, data: Partial<Game>): Promise<void> {
        throw new Error('Method not implemented.');
    }
    remove(filter: FilterQuery<Game>, multi: boolean): Promise<void> {
        throw new Error('Method not implemented.');
    }
    removeById(id: any): Promise<void> {
        throw new Error('Method not implemented.');
    }
    getCollection(): Collection<any> {
        throw new Error('Method not implemented.');
    }

}