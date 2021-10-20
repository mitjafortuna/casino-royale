import log from '../../../src/infrastructure/logger';
import Repository from '../../../src/infrastructure/repositories/repository';
import * as faker from 'faker';
import { Player } from '../../../src/domain/models/player';
import db from '../../../src/infrastructure/database';

if (process.env.NODE_ENV !== 'test') {
  log.error('Invalid environment for tests');
  process.exit(1);
}
let playerRepository: Repository<Player>;
describe('Player repository test', () => {
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

  describe('Test listAllActors', () => {
    it('check if create method creates player', async () => {
      // arrange and act
      const createdPlayer = await createPlayer();
      // assert
      expect(createdPlayer).not.toBeNull();
    });

    it('check if get method gets player', async () => {
      // arrange
      const createdPlayer = await createPlayer();
      let returnedPlayer;
      //act
      if (createdPlayer) {
        returnedPlayer = await playerRepository.get(createdPlayer._id);
      }
      // assert
      expect(returnedPlayer).not.toBeNull();
    });
    it('check if find method finds player', async () => {
      // arrange
      const createdPlayer = await createPlayer();
      // act
      const returnedPlayer = await playerRepository.find({
        _id: createdPlayer?._id,
      });
      // assert
      expect(returnedPlayer).not.toBeNull();
    });

    it('check if updateById method updates player', async () => {
      // arrange
      const createdPlayer = await createPlayer();
      if (createdPlayer) {
        const newLastName = 'Fortuna';
        createdPlayer.lastName = newLastName;
        // act
        await playerRepository.updateById(createdPlayer._id, {
          lastName: newLastName,
        });
      }
      let updatedPlayer;

      if (createdPlayer) {
        updatedPlayer = await playerRepository.get(createdPlayer._id);
      }
      // assert
      expect(updatedPlayer).not.toBeNull();
      expect(createdPlayer).toMatchObject(updatedPlayer as Player);
    });

    it('check if removeById method removes player', async () => {
      // arrange
      const createdPlayer = await createPlayer();
      let returnedPlayer;
      if (createdPlayer) {
        // act
        await playerRepository.removeById(createdPlayer._id);
        returnedPlayer = await playerRepository.get(createdPlayer?._id);
      }
      // assert
      expect(createdPlayer).not.toBeNull();
      expect(returnedPlayer).toBeNull();
    });
  });
});

async function clearDatabase() {
  await playerRepository.remove({}, true);
}

export async function createPlayer(
  firstName?: string,
  lastName?: string,
  movies?: string[]
) {
  firstName = firstName ?? faker.name.firstName();
  lastName = lastName ?? faker.name.lastName();
  movies = [faker.name.firstName(), faker.name.lastName()];
  try {
    const player = await playerRepository.create({
      firstName: firstName,
      lastName: lastName,
      movies: movies,
    } as Player);
    return player;
  } catch (err) {
    log.error(err);
  }
}

export async function createNPlayers(number: number) {
  while (number--) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const movies = [faker.name.firstName(), faker.name.lastName()];
    await createPlayer(firstName, lastName, movies);
  }
}
