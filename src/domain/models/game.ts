import { IModel } from './interfaces/model';
import { Player } from './player';

export class Game implements IModel {
    public constructor(
        public _id: string,
        public title: string,
        public description: string,
        public players: Player[],
        public pictures: string[]
      ) {}
}
