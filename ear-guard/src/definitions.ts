export interface EarGuardPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}
