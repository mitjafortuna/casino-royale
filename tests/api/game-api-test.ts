import request from 'supertest';
import log from '../../src/infrastructure/logger';
import faker from 'faker';
import db from '../../src/infrastructure/database';
import { Game } from '../../src/domain/models/game';
import Repository from '../../src/infrastructure/repositories/repository';
import createServer from '../../src/infrastructure/server';
import assert from 'assert';
import { Player } from '../../src/domain/models/player';

if (process.env.NODE_ENV !== 'test') {
  log.error('Invalid environment for tests');
  process.exit(1);
}

describe('Test games Api', () => {
  let server: any;
  let gameRepository: Repository<Game>;
  let playerRepository: Repository<Player>;
  beforeEach(async () => {
    try {
      await clearDatabase();
    } catch (err) {
      log.error(err);
    }
  });

  beforeAll(async () => {
    try {
      await db.connect();
      server = await createServer();
      gameRepository = new Repository<Game>('game');
      playerRepository = new Repository<Player>('player');
    } catch (err) {
      log.error(err);
    }
  });

  afterAll(async () => {
    try {
      await db.disconnect();
    } catch (err) {
      log.error(err);
    }
  });

  describe('Create game', () => {
    async function createGameRequest(
      body: {
        title?: string;
        description?: string;
        playerIds?: string[];
        pictures?: string[];
      },
      code: number,
      error?: any
    ) {
      const res = await request(server).post('/game').send(body).expect(code);
      if (error) {
        assert.deepEqual(res.body.errors, error);
      } else {
        expect(res.body).toMatchObject(body);
        expect(res.body).toHaveProperty('_id');
        expect(res.statusCode).toEqual(201);
      }
    }
    it('response 201 if success', async () => {
      const body = {
        title: faker.name.title(),
        description: faker.name.middleName(),
        playerIds: [(await createPlayer())._id, (await createPlayer())._id],
        pictures: [faker.name.firstName(), faker.name.lastName()],
      };
      await createGameRequest(body, 201);
    });

    it('response 400 if title field is empty', async () => {
      const body = {
        description: faker.name.middleName(),
        playerIds: [(await createPlayer())._id, (await createPlayer())._id],
        pictures: [faker.name.firstName(), faker.name.lastName()],
      };
      await createGameRequest(body, 400, [
        { msg: 'Invalid value', param: 'title', location: 'body' },
      ]);
    });

    it('response 400 if description field is empty', async () => {
      const body = {
        title: faker.name.title(),
        playerIds: [(await createPlayer())._id, (await createPlayer())._id],
        pictures: [faker.name.firstName(), faker.name.lastName()],
      };
      await createGameRequest(body, 400, [
        { msg: 'Invalid value', param: 'description', location: 'body' },
      ]);
    });

    it('response 400 if playerIds field is empty', async () => {
      const body = {
        title: faker.name.title(),
        description: faker.name.middleName(),
        pictures: [faker.name.firstName(), faker.name.lastName()],
      };
      await createGameRequest(body, 400, [
        {
          msg: 'playerIds should not be empty',
          param: 'playerIds',
          location: 'body',
        },
        {
          msg: 'playerIds should be list',
          param: 'playerIds',
          location: 'body',
        },
      ]);
    });
    it('response 400 if pictures field is empty', async () => {
      const body = {
        title: faker.name.title(),
        description: faker.name.middleName(),
        playerIds: [(await createPlayer())._id, (await createPlayer())._id],
      };
      await createGameRequest(body, 400, [
        {
          msg: 'Pictures should not be empty',
          param: 'pictures',
          location: 'body',
        },
        { msg: 'Pictures should be list', param: 'pictures', location: 'body' },
      ]);
    });
  });

  describe('Get game', () => {
    let game: Game;
    beforeEach(async () => {
      game = await createGame();
    });

    it('response 200 if successfully get game by id', async () => {
      const res = await request(server).get(`/game/${game._id}`).expect(200);
      assert.equal(typeof res.body, 'object');
      assert.equal(res.body.title, game.title);
      assert.equal(res.body.description, game.description);
      assert.deepEqual(res.body.playerIds, game.playerIds);
      assert.deepEqual(res.body.pictures, game.pictures);
    });

    it('response 404 if invalid id provided when get game by id', async () => {
      const res = await request(server).get('/game/invalidId').expect(404);
      assert.equal(res.text, 'Game with id invalidId was not found');
    });

    it('response 200 with list of games when get all games', async () => {
      const res = await request(server).get('/game').expect(200);
      assert.equal(Array.isArray(res.body), true);
      assert.equal(res.body.length, 1);
    });

    it('response 200 with N number of games when get all games', async () => {
      await createNGames(5);
      const res = await request(server).get('/game').expect(200);
      assert.equal(Array.isArray(res.body), true);
      assert.equal(res.body.length, 6);
    });

    it('response 200 with N number of games when get all games', async () => {
      await createNGames(5);
      const res = await request(server).get('/game?limit=3').expect(200);
      assert.equal(Array.isArray(res.body), true);
      assert.equal(res.body.length, 3);
    });

    it('response 200 with N number of games from 2nd page when get all games', async () => {
      await createNGames(5);
      const res = await request(server).get('/game?limit=3&page=2').expect(200);
      assert.equal(Array.isArray(res.body.data), true);
      assert.equal(res.body.data.length, 3);
    });

    it('response 200 with found games from given query when get all games', async () => {
      await createNGames(5);
      const res = await request(server)
        .get('/game?title=' + game.title)
        .expect(200);
      assert.equal(Array.isArray(res.body), true);
      assert.equal(res.body.length, 1);
      assert.equal(res.body[0].title, game.title);
      assert.equal(res.body[0].description, game.description);
      assert.deepEqual(res.body[0].playerIds, game.playerIds);
      assert.deepEqual(res.body[0].pictures, game.pictures);
    });
  });

  describe('Update game', () => {
    let game: Game;
    beforeEach(async () => {
      game = await createGame();
    });

    it('response 200 if successfully updates game by id and check if description is updated', async () => {
      const newTitle = faker.name.title();
      await request(server)
        .patch(`/game/${game._id}`)
        .send({
          title: newTitle,
          description: game.description,
          pictures: game.pictures,
          playerIds: game.playerIds,
        })
        .expect(200);
      const res1 = await request(server).get(`/game/${game._id}`).expect(200);
      assert.equal(typeof res1.body, 'object');
      assert.equal(res1.body.title, newTitle);
    });
  });

  describe('Delete game', () => {
    let game: Game;
    beforeEach(async () => {
      game = await createGame();
    });
    it('response 200 if successfully deletes game by id and 404 when trying to get delete game', async () => {
      await request(server).delete(`/game/${game._id}`).expect(200);
      await request(server).get(`/game/${game._id}`).expect(404);
    });
  });

  async function clearDatabase() {
    await gameRepository.remove({}, true);
    await playerRepository.remove({}, true);
  }

  async function createGame(
    title?: string,
    description?: string,
    playerIds?: string[],
    pictures?: string[]
  ) {
    title = title ?? faker.name.title();
    description = description ?? faker.name.middleName();
    playerIds = playerIds ?? [
      (await createPlayer())._id,
      (await createPlayer())._id,
    ];
    pictures = pictures ?? [faker.name.lastName(), faker.name.lastName()];
    const game = await gameRepository.create({
      title: title,
      description: description,
      playerIds: playerIds,
      pictures: pictures,
    } as Game);
    return game;
  }

  async function createNGames(number: number) {
    while (number--) {
      const title = faker.name.title();
      const description = faker.name.middleName();
      const playerIds = [
        (await createPlayer())._id,
        (await createPlayer())._id,
      ];
      const pictures = [faker.name.lastName(), faker.name.lastName()];
      await createGame(title, description, playerIds, pictures);
    }
  }
  async function createPlayer() {
    const player = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      birthDate: faker.date.past(),
    } as Player;
    return await playerRepository.create(player);
  }
});
