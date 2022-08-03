// envの型拡張

declare namespace NodeJS {
  interface ProcessEnv {
    readonly GANACHE_TODO_APP_CONTRACT_ADDRESS: string;
  }
}
