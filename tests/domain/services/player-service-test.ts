import { IRepository } from '../../../src/domain/models/interfaces/repository';
import { Player } from '../../../src/domain/models/player';
import { PlayerService } from '../../../src/domain/services/player-service';
import { PlayerRepositoryMock } from '../../mocks';

describe('Player service test', () => {
  let playerRepositoryMock: IRepository<Player>;
  beforeEach(async () => {
    playerRepositoryMock = new PlayerRepositoryMock();
  });

  describe('Test listAllActors', () => {
    it('calls repository\'s find method', async () => {
      // arrange
      const findMock = jest.fn();
      playerRepositoryMock.find = findMock;
      const service = new PlayerService(playerRepositoryMock);

      // act
      await service.listAllActors();

      // assert
      expect(findMock).toBeCalled();
    });
  });
});
