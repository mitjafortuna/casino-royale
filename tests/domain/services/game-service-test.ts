import {
  CreateGameDTO,
  UpdateGameDTO,
} from '../../../src/domain/dto/game-dtos';
import { GameService } from '../../../src/domain/services/game-service';
import { GameRepositoryMock } from '../../mocks';
import * as paginateModule from '../../../src/utils/paginate';
import { Game } from '../../../src/domain/models/game';
import { IRepository } from '../../../src/domain/models/interfaces/repository';

describe('Game service test', () => {
  let gameRepositoryMock: IRepository<Game>;
  beforeEach(async () => {
    gameRepositoryMock = new GameRepositoryMock();
  });

  describe('Test listAllGames', () => {
    it('calls repository\'s find method', async () => {
      // arrange
      const findMock = jest.fn();
      gameRepositoryMock.find = findMock;
      const service = new GameService(gameRepositoryMock);

      // act
      await service.listAllGames();

      // assert
      expect(findMock).toBeCalled();
    });
  });

  describe('Test listAllGamesWithPagination', () => {
    it('calls repository\'s find method', async () => {
      // arrange
      const findMock = jest.fn();
      gameRepositoryMock.find = findMock;
      const service = new GameService(gameRepositoryMock);

      // act
      await service.listAllGamesWithPagination(1, 1, '');

      // assert
      expect(findMock).toBeCalled();
    });

    it('calls paginate method', async () => {
      // arrange
      const paginateSpy = jest.spyOn(paginateModule, 'paginate');
      const findMock = jest.fn();
      gameRepositoryMock.find = findMock;
      const service = new GameService(gameRepositoryMock);

      // act
      await service.listAllGamesWithPagination(1, 1, '');

      // assert
      expect(paginateSpy).toBeCalled();
  
      paginateSpy.mockRestore();
    });
  });

  describe('Test searchGames', () => {
    it('calls repository\'s find method', async () => {
      // arrange
      const findMock = jest.fn();
      gameRepositoryMock.find = findMock;
      const service = new GameService(gameRepositoryMock);

      // act
      await service.searchGames({});

      // assert
      expect(findMock).toBeCalled();
    });
  });

  describe('Test createGame', () => {
    it('calls repository\'s create method', async () => {
      // arrange
      const createMock = jest.fn();
      gameRepositoryMock.create = createMock;
      const service = new GameService(gameRepositoryMock);

      const dto = {} as CreateGameDTO;

      // act
      await service.createGame(dto);

      // assert
      expect(createMock).toBeCalled();
    });
  });

  describe('Test getGame', () => {
    it('calls repository\'s get method', async () => {
      // arrange
      const getMock = jest.fn();
      gameRepositoryMock.get = getMock;
      const service = new GameService(gameRepositoryMock);

      // act
      await service.getGame('');

      // assert
      expect(getMock).toBeCalled();
    });
  });

  describe('Test updateGame', () => {
    it('calls repository\'s updateById method', async () => {
      // arrange
      const updateByIdMock = jest.fn();
      gameRepositoryMock.updateById = updateByIdMock;
      const service = new GameService(gameRepositoryMock);

      const dto = {} as UpdateGameDTO;

      // act
      await service.updateGame(dto);

      // assert
      expect(updateByIdMock).toBeCalled();
    });
  });

  describe('Test deleteGame', () => {
    it('calls repository\'s removeById method', async () => {
      // arrange
      const removeByIdMock = jest.fn();
      gameRepositoryMock.removeById = removeByIdMock;
      const service = new GameService(gameRepositoryMock);

      // act
      await service.deleteGame('');

      // assert
      expect(removeByIdMock).toBeCalled();
    });
  });
});
