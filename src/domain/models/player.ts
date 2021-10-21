import { IModel } from './interfaces/model';

export class Player implements IModel {
  public constructor(
    public _id: string,
    public firstName: string,
    public lastName: string,
    public birthDate: Date
  ) {}
}
