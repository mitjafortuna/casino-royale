import { body } from 'express-validator';

export function createGameValidation() {
  return [
    body('title').not().isEmpty(),
    body('description').not().isEmpty(),
    body('playerIds').not().isEmpty().withMessage('playerIds should not be empty'),
    body('playerIds').isArray().withMessage('playerIds should be list'),
    body('pictures')
      .not()
      .isEmpty()
      .withMessage('Pictures should not be empty'),
    body('pictures').isArray().withMessage('Pictures should be list'),
  ];
}
