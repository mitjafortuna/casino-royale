import { body } from 'express-validator';

export function createPlayerValidation() {
  return [
    body('firstName').not().isEmpty(),
    body('lastName').not().isEmpty(),
    body('movies').not().isEmpty().withMessage('Movies should not be empty'),
    body('movies').isArray().withMessage('Movies should be list'),
  ];
}
