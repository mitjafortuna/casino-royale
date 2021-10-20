import { body } from 'express-validator';

export function createGameValidation() {
  return [
    body('title').not().isEmpty(),
    body('description').not().isEmpty(),
    body('players').not().isEmpty().withMessage('Players should not be empty'),
    body('players').isArray().withMessage('Players should be list'),
    body('pictures')
      .not()
      .isEmpty()
      .withMessage('Pictures should not be empty'),
    body('pictures').isArray().withMessage('Pictures should be list'),
  ];
}
