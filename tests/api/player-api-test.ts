import request from 'supertest';
import log from '../../src/infrastructure/logger';
import faker from 'faker';
import db from '../../src/infrastructure/database';
import { Player } from '../../src/domain/models/player';
import Repository from '../../src/infrastructure/repositories/repository';
import createServer from '../../src/infrastructure/server';
import assert from 'assert';

if (process.env.NODE_ENV !== 'test') {
  log.error('Invalid environment for tests');
  process.exit(1);
}

describe('Test players Api', () => {
  let server: any;
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
      body: { firstName?: string; lastName?: string; movies?: string[] },
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
        movies: [faker.name.findName(), faker.animal.lion()],
      };
      await createPlayerRequest(body, 201);
    });

    it('response 400 if firstName field is empty', async () => {
      const body = {
        lastName: faker.name.lastName(),
        movies: [faker.name.findName(), faker.animal.lion()],
      };
      await createPlayerRequest(body, 400, [
        { msg: 'Invalid value', param: 'firstName', location: 'body' },
      ]);
    });

    it('response 400 if lastName field is empty', async () => {
      const body = {
        firstName: faker.name.firstName(),
        movies: [faker.name.findName(), faker.animal.lion()],
      };
      await createPlayerRequest(body, 400, [
        { msg: 'Invalid value', param: 'lastName', location: 'body' },
      ]);
    });

    it('response 400 if movies field is empty', async () => {
      const body = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      };
      await createPlayerRequest(body, 400, [
        {
          msg: 'Movies should not be empty',
          param: 'movies',
          location: 'body',
        },
        { msg: 'Movies should be list', param: 'movies', location: 'body' },
      ]);
    });
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
      assert.deepEqual(res.body.movies, player.movies);
    });

    it('response 404 if invalid id provided when get player by id', async () => {
      const res = await request(server).get('/player/invalidId').expect(404);
      assert.equal(res.text, 'Player with id invalidId was not found');
    });

    it('response 200 with list of players when get all players', async () => {
      const res = await request(server).get('/player').expect(200);
      assert.deepEqual(Array.isArray(res.body), true);
      assert.deepEqual(res.body.length, 1);
    });

    it('response 200 with N number of players when get all players', async () => {
      await createNPlayers(5);
      const res = await request(server).get('/player').expect(200);
      assert.deepEqual(Array.isArray(res.body), true);
      assert.deepEqual(res.body.length, 6);
    });

    it('response 200 with N number of players when get all players', async () => {
      await createNPlayers(5);
      const res = await request(server).get('/player?limit=3').expect(200);
      assert.deepEqual(Array.isArray(res.body), true);
      assert.deepEqual(res.body.length, 3);
    });

    it('response 200 with N number of players from 2nd page when get all players', async () => {
      await createNPlayers(5);
      const res = await request(server)
        .get('/player?limit=3&page=2')
        .expect(200);
      assert.deepEqual(Array.isArray(res.body.data), true);
      assert.deepEqual(res.body.data.length, 3);
    });

    it('response 200 with found players from given query when get all players', async () => {
      await createNPlayers(5);
      const res = await request(server)
        .get('/player?firstName=' + player.firstName)
        .expect(200);
      assert.deepEqual(Array.isArray(res.body), true);
      assert.deepEqual(res.body.length, 1);
      assert.equal(res.body[0].firstName, player.firstName);
      assert.equal(res.body[0].lastName, player.lastName);
      assert.deepEqual(res.body[0].movies, player.movies);
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
    movies?: string[]
  ) {
    firstName = firstName ?? faker.name.firstName();
    lastName = lastName ?? faker.name.lastName();
    movies = [faker.name.firstName(), faker.name.lastName()];
    const player = await playerRepository.create({
      firstName: firstName,
      lastName: lastName,
      movies: movies,
    } as Player);
    return player;
  }

  async function createNPlayers(number: number) {
    while (number--) {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const movies = [faker.name.firstName(), faker.name.lastName()];
      await createPlayer(firstName, lastName, movies);
    }
  }
});
