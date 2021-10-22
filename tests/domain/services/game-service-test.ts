import {
  CreateGameDto,
  UpdateGameDto,
} from '../../../src/domain/dto/game-dtos';
import { GameService } from '../../../src/domain/services/game-service';
import { GameRepositoryMock, PlayerRepositoryMock } from '../../mocks';
import * as paginateModule from '../../../src/utils/paginate';
import { Game } from '../../../src/domain/models/game';
import { IRepository } from '../../../src/domain/models/interfaces/repository';
import { NotFoundError } from '../../../src/infrastructure/errors/app-errors';
import { Player } from '../../../src/domain/models/player';
import faker from 'faker';

describe('Game service test', () => {
  let gameRepositoryMock: IRepository<Game>;
  let playerRepositoryMock: IRepository<Player>;
  let gameMock: Game;
  let playerMock: Player;
  beforeEach(async () => {
    gameRepositoryMock = new GameRepositoryMock();
    playerRepositoryMock = new PlayerRepositoryMock();
    gameMock = new Game('', '', '', [''], ['']);
    playerMock = new Player('', '', '', faker.date.past());
  });

  describe('Test listAllGames', () => {
    it("calls game repository's find method and player's repository find", async () => {
      // arrange
      const findMock = jest.fn(async () => [gameMock]);
      gameRepositoryMock.find = findMock;
      const findFromPlayerRepositoryMock = jest.fn();
      playerRepositoryMock.find = findFromPlayerRepositoryMock;
      const service = new GameService(gameRepositoryMock, playerRepositoryMock);

      // act
      await service.getAllGames({ path: '' });

      // assert
      expect(findMock).toBeCalled();
      expect(findFromPlayerRepositoryMock).toBeCalled();
    });
    it('calls paginate method', async () => {
      // arrange
      const paginateSpy = jest.spyOn(paginateModule, 'paginate');
      const findMock = jest.fn(async () => [gameMock]);
      gameRepositoryMock.find = findMock;
      const findFromPlayerRepositoryMock = jest.fn();
      playerRepositoryMock.find = findFromPlayerRepositoryMock;
      const service = new GameService(gameRepositoryMock, playerRepositoryMock);

      // act
      await service.getAllGames({ path: '', limit: 1, pageNumber: 1 });

      // assert
      expect(paginateSpy).toBeCalled();

      paginateSpy.mockRestore();
    });
  });

  describe('Test searchGames', () => {
    it("calls game repository's find method and player repository's find method", async () => {
      // arrange
      const findMock = jest.fn(async () => [gameMock]);
      gameRepositoryMock.find = findMock;
      const findFromPlayerRepositoryMock = jest.fn();
      playerRepositoryMock.find = findFromPlayerRepositoryMock;
      const service = new GameService(gameRepositoryMock, playerRepositoryMock);

      // act
      await service.searchGames({});

      // assert
      expect(findMock).toBeCalled();
      expect(findFromPlayerRepositoryMock).toBeCalled();
    });
  });

  describe('Test createGame', () => {
    it("calls game repository's create method and player's repository get and find method", async () => {
      // arrange
      const createMock = jest.fn(async () => gameMock);
      gameRepositoryMock.create = createMock;
      const getFromPlayerRepositoryMock = jest.fn(async () => playerMock);
      playerRepositoryMock.get = getFromPlayerRepositoryMock;
      const findFromPlayerRepositoryMock = jest.fn(async () => [playerMock]);
      playerRepositoryMock.find = findFromPlayerRepositoryMock;

      const service = new GameService(gameRepositoryMock, playerRepositoryMock);

      const dto = {
        title: '',
        description: '',
        pictures: [''],
        playerIds: [''],
      } as CreateGameDto;

      // act
      await service.createGame(dto);

      // assert
      expect(createMock).toBeCalled();
      expect(getFromPlayerRepositoryMock).toBeCalled();
      expect(findFromPlayerRepositoryMock).toBeCalled();
    });
    it("calls repository's create method and get method form plyerRepository returns null should throw", async () => {
      // arrange
      const createMock = jest.fn();
      gameRepositoryMock.create = createMock;
      playerRepositoryMock.get = async () => null;
      const service = new GameService(gameRepositoryMock, playerRepositoryMock);

      const dto = {
        playerIds: [''],
      } as CreateGameDto;

      // act and assert
      await expect(service.createGame(dto)).rejects.toThrow(NotFoundError);
    });
  });

  describe('Test getGame', () => {
    it("calls game repository's get method and player repository's find method", async () => {
      // arrange
      const getMock = jest.fn(async () => gameMock);
      gameRepositoryMock.get = getMock;
      const findFromPlayerRepositoryMock = jest.fn();
      playerRepositoryMock.find = findFromPlayerRepositoryMock;
      const service = new GameService(gameRepositoryMock, playerRepositoryMock);

      // act
      await service.getGame('');

      // assert
      expect(getMock).toBeCalled();
      expect(findFromPlayerRepositoryMock).toBeCalled();
    });
    it("should throw NotFoundError if game repository's get method returns null", async () => {
      // arrange
      gameRepositoryMock.get = jest.fn(async () => null);
      const service = new GameService(gameRepositoryMock, playerRepositoryMock);

      // act and assert
      await expect(service.getGame('')).rejects.toThrow(NotFoundError);
    });
  });

  describe('Test updateGame', () => {
    it("calls game's repository updateById method and player repository's get ", async () => {
      // arrange
      const updateByIdMock = jest.fn();
      gameRepositoryMock.updateById = updateByIdMock;
      const getFromPlayerRepositoryMock = jest.fn();
      playerRepositoryMock.get = getFromPlayerRepositoryMock;
      const service = new GameService(gameRepositoryMock, playerRepositoryMock);

      const dto = {
        playerIds: [''],
      } as UpdateGameDto;

      // act
      await service.updateGame(dto);

      // assert
      expect(updateByIdMock).toBeCalled();
      expect(getFromPlayerRepositoryMock).toBeCalled();
    });

    it("calls repository's updateById method but get from playerRepository returns null should throw", async () => {
      // arrange
      const updateByIdMock = jest.fn();
      gameRepositoryMock.updateById = updateByIdMock;
      const getFromPlayerRepositoryMock = jest.fn(async () => null);
      playerRepositoryMock.get = getFromPlayerRepositoryMock;
      const service = new GameService(gameRepositoryMock, playerRepositoryMock);

      const dto = {
        playerIds: [''],
      } as UpdateGameDto;

      // act and assert
      await expect(service.updateGame(dto)).rejects.toThrow(NotFoundError);
    });
  });

  describe('Test deleteGame', () => {
    it("calls repository's removeById method", async () => {
      // arrange
      const removeByIdMock = jest.fn();
      gameRepositoryMock.removeById = removeByIdMock;
      const service = new GameService(gameRepositoryMock, playerRepositoryMock);

      // act
      await service.deleteGame('');

      // assert
      expect(removeByIdMock).toBeCalled();
    });
  });
});
