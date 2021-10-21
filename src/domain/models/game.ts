import { IModel } from './interfaces/model';
import { Player } from './player';

export class Game implements IModel {
  public constructor(
    public _id: string,
    public title: string,
    public description: string,
    public playerIds: string[],
    public pictures: string[]
  ) {}
}

export class GameWithEnrichedPlayers extends Game {
  public constructor(
    public _id: string,
    public title: string,
    public description: string,
    public playerIds: string[],
    public pictures: string[],
    public players: (Player | null)[]
  ) {
    super(_id, title, description, playerIds, pictures);
  }
}
