import { refreshHandler } from './refresh/handler';
import { selectTenantHandler } from './selectTenant/handler';
import { sessionHandler } from './session/handler';
import { signinHandler } from './signIn/handler';
import { signoutHandler } from './signOut/handler';
import { ROUTE, type RouteHandler, type RouteKey } from './types';

/**
 * Route Handler Map - Maps route names to handler functions
 */
export const HANDLERS: Record<RouteKey, RouteHandler> = {
  [ROUTE.SESSION]: sessionHandler,
  [ROUTE.SIGNIN]: signinHandler,
  [ROUTE.SELECT_TENANT]: selectTenantHandler,
  [ROUTE.SIGNOUT]: signoutHandler,
  [ROUTE.REFRESH]: refreshHandler,
};
