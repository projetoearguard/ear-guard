import { registerPlugin } from '@capacitor/core';

import type { EarGuardPlugin } from './definitions';

const EarGuard = registerPlugin<EarGuardPlugin>('EarGuard', {
  web: () => import('./web').then((m) => new m.EarGuardWeb()),
});

export * from './definitions';
export { EarGuard };
