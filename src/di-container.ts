import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './domain/types';
import { GameService } from './domain/services/game-service';
import { IGameService } from './domain/services/interfaces/game-service';
import { PlayerService } from './domain/services/player-service';
import { IPlayerService } from './domain/services/interfaces/player-service';
import { GameRepository } from './infrastructure/repositories/game-repository';
import { PlayerRepository } from './infrastructure/repositories/player-repository';
import { Player } from './domain/models/player';
import { IRepository } from './domain/models/interfaces/repository';
import { Game } from './domain/models/game';
import PlayerApi from './api/player-api';
import GameApi from './api/game-api';

const container = new Container({
  defaultScope: 'Singleton',
  skipBaseClassChecks: true,
});

container.bind(PlayerApi).to(PlayerApi);
container.bind(GameApi).to(GameApi);

container.bind<IRepository<Game>>(TYPES.IGameRepository).to(GameRepository);
container
  .bind<IRepository<Player>>(TYPES.IPlayerRepository)
  .to(PlayerRepository);

container.bind<IGameService>(TYPES.IGameService).to(GameService);
container.bind<IPlayerService>(TYPES.IPlayerService).to(PlayerService);

export default container;
