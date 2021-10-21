import { body } from 'express-validator';

export function createPlayerValidation() {
  return [
    body('firstName').not().isEmpty(),
    body('lastName').not().isEmpty(),
    body('birthDate').not().isEmpty().withMessage('birthDate should not be empty'),
    body('birthDate').isDate()
  ];
}
