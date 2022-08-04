// envの型拡張

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NEXT_PUBLIC_GANACHE_TODO_APP_CONTRACT_ADDRESS: string;
  }
}
