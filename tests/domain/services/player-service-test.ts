import {
  GamesPlayedByPlayerDto,
  PlayerDto,
  PlayerGetDto,
  UpdatePlayerDto,
} from '../../../src/domain/dto/player-dtos';
import { Game } from '../../../src/domain/models/game';
import { IRepository } from '../../../src/domain/models/interfaces/repository';
import { Player } from '../../../src/domain/models/player';
import { PlayerService } from '../../../src/domain/services/player-service';
import { NotFoundError } from '../../../src/infrastructure/errors/app-errors';
import { GameRepositoryMock, PlayerRepositoryMock } from '../../mocks';

describe('Player service test', () => {
  let playerRepositoryMock: IRepository<Player>;
  let gameRepositoryMock: IRepository<Game>;
  beforeEach(async () => {
    playerRepositoryMock = new PlayerRepositoryMock();
    gameRepositoryMock = new GameRepositoryMock();
  });

  describe('Test listAllActors', () => {
    it("calls repository's find method", async () => {
      // arrange
      const findMock = jest.fn();
      playerRepositoryMock.find = findMock;
      const service = new PlayerService(
        playerRepositoryMock,
        gameRepositoryMock
      );

      // act
      await service.getAllPlayers({ path: '' } as PlayerGetDto);

      // assert
      expect(findMock).toBeCalled();
    });
  });

  describe('Test getAllGamesPlayedByPlayer', () => {
    it("calls game repository's find method and player repository's get method", async () => {
      // arrange
      const findMock = jest.fn();
      gameRepositoryMock.find = findMock;

      const getMock = jest.fn();
      playerRepositoryMock.get = getMock;
      const service = new PlayerService(
        playerRepositoryMock,
        gameRepositoryMock
      );

      // act
      await service.getAllGamesPlayedByPlayer({
        playerId: '',
        path: '',
      } as GamesPlayedByPlayerDto);

      // assert
      expect(findMock).toBeCalled();
      expect(getMock).toBeCalled();
    });
  });

  describe('Test createPlayer', () => {
    it("calls repository's create method", async () => {
      // arrange
      const createMock = jest.fn();
      playerRepositoryMock.create = createMock;
      const service = new PlayerService(
        playerRepositoryMock,
        gameRepositoryMock
      );

      const dto = {} as PlayerDto;

      // act
      await service.createPlayer(dto);

      // assert
      expect(createMock).toBeCalled();
    });
  });

  describe('Test getPlayer', () => {
    it("calls repository's get method", async () => {
      // arrange
      const getMock = jest.fn();
      playerRepositoryMock.get = getMock;
      const service = new PlayerService(
        playerRepositoryMock,
        gameRepositoryMock
      );

      // act
      await service.getPlayer('');

      // assert
      expect(getMock).toBeCalled();
    });
    it("should throw NotFoundError if repository's get method returns null", async () => {
      // arrange
      playerRepositoryMock.get = jest.fn(async () => null);
      const service = new PlayerService(
        playerRepositoryMock,
        gameRepositoryMock
      );

      // act and assert
      await expect(service.getPlayer('')).rejects.toThrow(NotFoundError);
      //await expect(service.getPlayer('')).rejects.toHaveProperty('message',`Player with id was not found`);
    });
  });

  describe('Test updatePlayer', () => {
    it("calls repository's updateById method", async () => {
      // arrange
      const updateByIdMock = jest.fn();
      playerRepositoryMock.updateById = updateByIdMock;
      const service = new PlayerService(
        playerRepositoryMock,
        gameRepositoryMock
      );

      const dto = {} as UpdatePlayerDto;

      // act
      await service.updatePlayer(dto);

      // assert
      expect(updateByIdMock).toBeCalled();
    });
  });

  describe('Test deletePlayer', () => {
    it("calls repository's removeById method", async () => {
      // arrange
      const removeByIdMock = jest.fn();
      playerRepositoryMock.removeById = removeByIdMock;
      const service = new PlayerService(
        playerRepositoryMock,
        gameRepositoryMock
      );

      // act
      await service.deletePlayer('');

      // assert
      expect(removeByIdMock).toBeCalled();
    });
  });
});
