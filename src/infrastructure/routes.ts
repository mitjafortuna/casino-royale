import { Application } from 'express';
import container from '../di-container';
import asyncWrap from '../utils/async-wrapper';

import PlayerApi from '../api/player-api';
import GameApi from '../api/game-api';
import { createPlayerValidation } from '../api/validations/player-api-validation';
import { createGameValidation } from '../api/validations/game-api-validation';

/**
 * Configure all the services with the express application
 */
export default function (app: Application) {
  // Iterate over all our controllers and register our routes
  const playerApiInstance = container.get<PlayerApi>(PlayerApi);
  const gameApiInstance = container.get<GameApi>(GameApi);
  app.get(
    '/player',
    asyncWrap(playerApiInstance.getAllPlayers.bind(playerApiInstance))
  );
  app.get(
    '/player/:id',
    asyncWrap(playerApiInstance.get.bind(playerApiInstance))
  );
  app.post(
    '/player',
    createPlayerValidation(),
    asyncWrap(playerApiInstance.create.bind(playerApiInstance))
  );
  app.patch(
    '/player/:id',
    asyncWrap(playerApiInstance.updatePlayer.bind(playerApiInstance))
  );
  app.delete(
    '/player/:id',
    asyncWrap(playerApiInstance.delete.bind(playerApiInstance))
  );

  app.get(
    '/game',
    asyncWrap(gameApiInstance.getAllGames.bind(gameApiInstance))
  );
  app.get('/game/:id', asyncWrap(gameApiInstance.get.bind(gameApiInstance)));
  app.post('/game', createGameValidation(), asyncWrap(gameApiInstance.create.bind(gameApiInstance)));
  app.patch(
    '/game/:id',
    asyncWrap(gameApiInstance.updateGame.bind(gameApiInstance))
  );
  app.delete(
    '/game/:id',
    asyncWrap(gameApiInstance.delete.bind(gameApiInstance))
  );
}
