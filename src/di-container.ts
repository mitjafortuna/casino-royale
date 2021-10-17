import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './domain/types';
import { GameService } from './domain/services/game-service';
import { IGameService } from './domain/services/interfaces/game-service';
import { PlayerService } from './domain/services/player-service';
import { IPlayerService } from './domain/services/interfaces/player-service';
import { IGameRepository } from './domain/models/interfaces/game-repository';
import { GameRepository } from './infrastructure/repositories/game-repository';
import { PlayerRepository } from './infrastructure/repositories/player-repository';
import { IPlayerRepository } from './domain/models/interfaces/player-repository';

const container = new Container({
  defaultScope: 'Singleton',
  skipBaseClassChecks: true,
});

container.bind<IGameRepository>(TYPES.IGameRepository).to(GameRepository);
container.bind<IPlayerRepository>(TYPES.IPlayerRepository).to(PlayerRepository);

container.bind<IGameService>(TYPES.IGameService).to(GameService);
container.bind<IPlayerService>(TYPES.IPlayerService).to(PlayerService);

export default container;
