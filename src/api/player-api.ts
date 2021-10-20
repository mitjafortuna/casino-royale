import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '../domain/types';
import { IPlayerService } from '../domain/services/interfaces/player-service';
import { MissingFieldError } from '../infrastructure/errors/app-errors';
import { PlayerDto, UpdatePlayerDto } from '../domain/dto/player-dtos';
import { validationResult } from 'express-validator';

@injectable()
export default class PlayerApi {
  constructor(
    @inject(TYPES.IPlayerService) private playerService: IPlayerService
  ) {}

  public async getAllPlayers(req: Request, res: Response): Promise<void> {
    // clone query object and delete limit and page property
    const filter = { ...req.query };
    delete filter.limit;
    delete filter.page;
    const response = await this.playerService.getAllPlayers({
      path: req.path,
      limit: req.query?.limit ? parseInt(req.query.limit as string) : undefined,
      pageNumber: req.query?.page
        ? parseInt(req.query.page as string)
        : undefined,
      filter: filter,
    });
    res.send(response);
  }

  /**
   * Create player
   * @param req
   * @param res
   */
  public async create(req: Request, res: Response) {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const createUserDto: PlayerDto = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      movies: req.body.movies,
    };

    const response = await this.playerService.createPlayer(createUserDto);

    res.status(201).send(response);
  }

  /**
   * Update player
   * @param req
   * @param res
   */
  public async updatePlayer(req: Request, res: Response) {
    if (!req.params.id) {
      throw new MissingFieldError('id');
    }

    const updatePlayerDto = {
      id: req.params.id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      movies: req.body.movies,
    } as UpdatePlayerDto;

    await this.playerService.updatePlayer(updatePlayerDto);

    res.sendStatus(200);
  }
  /**
   * Get player
   * @param req
   * @param res
   */
  public async get(req: Request, res: Response): Promise<void> {
    const player = await this.playerService.getPlayer(req.params.id);
    res.send(player);
  }

  /**
   * Delete player
   * @param req
   * @param res
   */
  public async delete(req: Request, res: Response): Promise<void> {
    await this.playerService.deletePlayer(req.params.id);
    res.sendStatus(200);
  }
}
