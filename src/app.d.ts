declare global {
  namespace App {
    interface Platform {
      env: {
        OBDB_METRICS: KVNamespace;
      };
      context: {
        waitUntil(promise: Promise<any>): void;
      };
      caches: CacheStorage & { default: Cache };
    }
  }
}

export {};
