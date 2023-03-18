class ParserPool {
  private alias: Record<string, string>;

  public constructor() {
    this.alias = {};
  }

  public register(resolve: string, alias?: string): void {
    this.addAlias(resolve, resolve);
    if (alias) {
      this.addAlias(alias, resolve);
    }
  }

  private addAlias(resolve: string, value: string): void {
    if (!value) {
      throw new Error(`Invalid alias (${value})`);
    }
    if (resolve in this.alias) {
      throw new Error(
        `${resolve} is already registered. It resolves to ${this.alias[resolve]}.`
      );
    }
    this.alias[resolve] = value;
  }

  public get(resolve: string): string {
    if (!(resolve in this.alias)) {
      throw new Error(`${resolve} is not registered`);
    }
    return this.alias[resolve];
  }
}

export const pool = new ParserPool();
