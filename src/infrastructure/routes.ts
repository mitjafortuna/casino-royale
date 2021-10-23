import { Application } from 'express';
import container from '../di-container';
import asyncWrap from '../utils/async-wrapper';
import PlayerApi from '../api/player-api';
import GameApi from '../api/game-api';
import { createPlayerValidation } from '../api/validations/player-api-validation';
import { createGameValidation } from '../api/validations/game-api-validation';

export function PlayerRoutes(app: Application) {
  const playerApiInstance = container.get<PlayerApi>(PlayerApi);

  app.get(
    '/player',
    asyncWrap(playerApiInstance.getAllPlayers.bind(playerApiInstance))
  );

  app.get(
    '/player/:id',
    asyncWrap(playerApiInstance.get.bind(playerApiInstance))
  );

  app.get(
    '/player/games/:playerId',
    asyncWrap(
      playerApiInstance.getAllGamesPlayedByPlayer.bind(playerApiInstance)
    )
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
}

export function GameRoutes(app: Application) {
  const gameApiInstance = container.get<GameApi>(GameApi);

  app.get(
    '/game',
    asyncWrap(gameApiInstance.getAllGames.bind(gameApiInstance))
  );

  app.get('/game/:id', asyncWrap(gameApiInstance.get.bind(gameApiInstance)));

  app.post(
    '/game',
    createGameValidation(),
    asyncWrap(gameApiInstance.create.bind(gameApiInstance))
  );

  app.patch(
    '/game/:id',
    asyncWrap(gameApiInstance.updateGame.bind(gameApiInstance))
  );

  app.delete(
    '/game/:id',
    asyncWrap(gameApiInstance.delete.bind(gameApiInstance))
  );
}
