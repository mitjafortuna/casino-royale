import { Select, Sort } from '../src/domain/models/interfaces/repository';
import { Game } from '../src/domain/models/game';
import { IGameRepository } from '../src/domain/models/interfaces/game-repository';
import { IPlayerRepository } from '../src/domain/models/interfaces/player-repository';
import { Player } from '../src/domain/models/player';
import { FilterQuery, Collection } from 'mongodb';

export class GameRepositoryMock implements IGameRepository{
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

export class PlayerRepositoryMock implements IPlayerRepository {
    get(id: any, select?: Select): Promise<Player> {
        throw new Error('Method not implemented.');
    }
    find(filter: FilterQuery<Partial<Player>>, limit?: number, page?: number, select?: Select, sort?: Sort): Promise<Player[]> {
        throw new Error('Method not implemented.');
    }
    create(data: Partial<Player>): Promise<Player> {
        throw new Error('Method not implemented.');
    }
    createMany(data: Player[]): Promise<Player[]> {
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