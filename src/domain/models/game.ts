import { Player } from './player';

export class Game {
    public constructor(
        public id: string,
        public title: string,
        public description: string,
        public players: Player[],
        public pictures: string[]
      ) {}
}
