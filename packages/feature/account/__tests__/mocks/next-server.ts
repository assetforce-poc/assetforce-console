/**
 * Mock for next/server module
 *
 * This mock is needed because next/server uses Request/Response globals
 * which are not available in jsdom test environment.
 */

export class NextResponse {
  static json(data: unknown, init?: ResponseInit) {
    return { data, init };
  }

  static redirect(url: string | URL, status?: number) {
    return { url, status };
  }

  static next() {
    return {};
  }
}

export type NextRequest = Request;
