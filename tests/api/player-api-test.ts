import request from 'supertest';
import log from '../../src/infrastructure/logger';
import faker, { unique } from 'faker';
import db from '../../src/infrastructure/database';
import { Player } from '../../src/domain/models/player';
import Repository from '../../src/infrastructure/repositories/repository';
import createServer from '../../src/infrastructure/server';
import assert from 'assert';
import { Game } from '../../src/domain/models/game';

if (process.env.NODE_ENV !== 'test') {
  log.error('Invalid environment for tests');
  process.exit(1);
}

describe('Test players Api', () => {
  let server: any;
  let playerRepository: Repository<Player>;
  let gameRepository: Repository<Game>;
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

  describe('Create player', () => {
    async function createPlayerRequest(
      body: { firstName?: string; lastName?: string; birthDate?: string },
      code: number,
      error?: any
    ) {
      const res = await request(server).post('/player').send(body).expect(code);
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
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        birthDate: faker.date.past().toISOString().split('T')[0],
      };
      await createPlayerRequest(body, 201);
    });

    it('response 400 if firstName field is empty', async () => {
      const body = {
        lastName: faker.name.lastName(),
        birthDate: faker.date.past().toISOString().split('T')[0],
      };
      await createPlayerRequest(body, 400, [
        { msg: 'Invalid value', param: 'firstName', location: 'body' },
      ]);
    });

    it('response 400 if lastName field is empty', async () => {
      const body = {
        firstName: faker.name.firstName(),
        birthDate: faker.date.past().toISOString().split('T')[0],
      };
      await createPlayerRequest(body, 400, [
        { msg: 'Invalid value', param: 'lastName', location: 'body' },
      ]);
    });

    it('response 400 if birthDate field is empty', async () => {
      const body = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      };
      await createPlayerRequest(body, 400, [
        {
          msg: 'birthDate should not be empty',
          param: 'birthDate',
          location: 'body',
        },
        { msg: 'Invalid value', param: 'birthDate', location: 'body' },
      ]);
    });

    // it('response 400 if birthDate is not date', async () => {
    //   const body = {
    //     birthDate: ''
    //   };
    //   await createPlayerRequest(body, 400, [
    //     {
    //       msg: 'birthDate should not be empty',
    //       param: 'birthDate',
    //       location: 'body',
    //     },
    //     { msg: 'birthDate should be list', param: 'birthDate', location: 'body' },
    //   ]);
    // });
  });

  describe('Get player', () => {
    let player: Player;
    beforeEach(async () => {
      player = await createPlayer();
    });

    it('response 200 if successfully get player by id', async () => {
      const res = await request(server)
        .get(`/player/${player._id}`)
        .expect(200);
      assert.equal(typeof res.body, 'object');
      assert.equal(res.body.firstName, player.firstName);
      assert.equal(res.body.lastName, player.lastName);
      assert.equal(res.body.birthDate, player.birthDate.toISOString());
    });

    it('response 404 if invalid id provided when get player by id', async () => {
      const res = await request(server).get('/player/invalidId').expect(404);
      assert.equal(res.text, 'Player with id invalidId was not found');
    });

    it('response 200 with list of players when get all players', async () => {
      const res = await request(server).get('/player').expect(200);
      assert.equal(Array.isArray(res.body), true);
      assert.equal(res.body.length, 1);
    });

    it('response 200 with N number of players when get all players', async () => {
      await createNPlayers(5);
      const res = await request(server).get('/player').expect(200);
      assert.equal(Array.isArray(res.body), true);
      assert.equal(res.body.length, 6);
    });

    it('response 200 with N number of players when get all players', async () => {
      await createNPlayers(5);
      const res = await request(server).get('/player?limit=3').expect(200);
      assert.equal(Array.isArray(res.body), true);
      assert.equal(res.body.length, 3);
    });

    it('response 200 with N number of players from 2nd page when get all players', async () => {
      await createNPlayers(5);
      const res = await request(server)
        .get('/player?limit=3&page=2')
        .expect(200);
      assert.equal(Array.isArray(res.body.data), true);
      assert.equal(res.body.data.length, 3);
    });

    it('response 200 with found players from given query when get all players', async () => {
      await createNPlayers(5);
      const res = await request(server)
        .get('/player?firstName=' + player.firstName)
        .expect(200);
      assert.equal(Array.isArray(res.body), true);
      assert.equal(res.body.length, 1);
      assert.equal(res.body[0].firstName, player.firstName);
      assert.equal(res.body[0].lastName, player.lastName);
      assert.equal(res.body[0].birthDate, player.birthDate.toISOString());
    });
  });

  describe('Get Games Played By Player', () => {
    let player: Player;
    let game: Game;
    beforeEach(async () => {
      player = await createPlayer();
      game = await createGame(undefined, undefined, [player._id]);
    });

    it('response 200 if successfully get games played by player by id', async () => {
      const res = await request(server)
        .get(`/player/games/${player._id}`)
        .expect(200);
      assert.equal(Array.isArray(res.body), true);
      assert.equal(res.body.length, 1);
      assert.equal(res.body[0].title, game.title);
      assert.equal(res.body[0].description, game.description);
      assert.deepEqual(res.body[0].playerIds, game.playerIds);
      assert.deepEqual(res.body[0].pictures, game.pictures);
    });

    it('response 404 if invalid id provided when get games played by player by id', async () => {
      const res = await request(server)
        .get('/player/games/invalidId')
        .expect(404);
      assert.equal(res.text, 'Player with id invalidId was not found');
    });
  });
  describe('Update player', () => {
    let player: Player;
    beforeEach(async () => {
      player = await createPlayer();
    });

    it('response 200 if successfully updates player by id and check if lastName is updated', async () => {
      const newLastName = faker.name.lastName();
      await request(server)
        .patch(`/player/${player._id}`)
        .send({ lastName: newLastName })
        .expect(200);
      const res1 = await request(server)
        .get(`/player/${player._id}`)
        .expect(200);
      assert.equal(typeof res1.body, 'object');
      assert.equal(res1.body.lastName, newLastName);
    });
  });

  describe('Delete player', () => {
    let player: Player;
    beforeEach(async () => {
      player = await createPlayer();
    });

    it('response 200 if successfully deletes player by id and 404 when trying to get delete player', async () => {
      await request(server).delete(`/player/${player._id}`).expect(200);
      await request(server).get(`/player/${player._id}`).expect(404);
    });
  });

  async function clearDatabase() {
    await playerRepository.remove({}, true);
  }

  async function createPlayer(
    firstName?: string,
    lastName?: string,
    birthDate?: Date
  ) {
    firstName = firstName ?? faker.name.firstName();
    lastName = lastName ?? faker.name.lastName();
    birthDate = faker.date.past();
    const player = await playerRepository.create({
      firstName: firstName,
      lastName: lastName,
      birthDate: birthDate,
    } as Player);
    return player;
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

  async function createNPlayers(number: number): Promise<Player[]> {
    const playerArray = [];
    while (number--) {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const birthDate = faker.date.past();
      playerArray.push(await createPlayer(firstName, lastName, birthDate));
    }
    return playerArray;
  }
});
