import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '../domain/types';
import { IGameService } from '../domain/services/interfaces/game-service';
import { MissingFieldError } from '../infrastructure/errors/app-errors';
import { CreateGameDto, UpdateGameDto } from '../domain/dto/game-dtos';
import { validationResult } from 'express-validator';

@injectable()
export default class GameApi {
  constructor(@inject(TYPES.IGameService) private gameService: IGameService) {}

  public async getAllGames(req: Request, res: Response): Promise<void> {
    // clone query object and delete limit and page property
    const filter = { ...req.query };
    delete filter.limit;
    delete filter.page;
    const response = await this.gameService.getAllGames({
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
   * Create game
   * @param req
   * @param res
   */
  public async create(req: Request, res: Response) {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const createUserDto: CreateGameDto = {
      title: req.body.title,
      description: req.body.description,
      playerIds: req.body.playerIds,
      pictures: req.body.pictures,
    };

    const response = await this.gameService.createGame(createUserDto);

    res.status(201).send(response);
  }

  /**
   * Update game
   * @param req
   * @param res
   */
  public async updateGame(req: Request, res: Response) {
    if (!req.params.id) {
      throw new MissingFieldError('id');
    }

    const updateGameDto = {
      id: req.params.id,
      title: req.body.title,
      description: req.body.description,
      playerIds: req.body.playerIds,
      pictures: req.body.pictures,
    } as UpdateGameDto;

    await this.gameService.updateGame(updateGameDto);

    res.sendStatus(200);
  }
  /**
   * Get game
   * @param req
   * @param res
   */
  public async get(req: Request, res: Response): Promise<void> {
    if (!req.params.id) {
      throw new MissingFieldError('id');
    }

    const game = await this.gameService.getGame(req.params.id);
    res.send(game);
  }

  /**
   * Delete game
   * @param req
   * @param res
   */
  public async delete(req: Request, res: Response): Promise<void> {
    if (!req.params.id) {
      throw new MissingFieldError('id');
    }
    await this.gameService.deleteGame(req.params.id);
    res.sendStatus(200);
  }
}
