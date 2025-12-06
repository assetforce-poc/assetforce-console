/**
 * MSW server for @assetforce/authentication tests
 */

import { setupServer } from 'msw/node';

import { handlers } from './handlers';

export const server = setupServer(...handlers);
