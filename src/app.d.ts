declare global {
  namespace App {
    interface Platform {
      context: {
        waitUntil(promise: Promise<unknown>): void;
      };
    }
  }
}

export {};
