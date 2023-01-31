import { configureObservablePersistence } from '@legendapp/state/persist';
import { ObservablePersistMMKV } from '@legendapp/state/persist-plugins/mmkv';

export function configurePersistenceLayer() {
  configureObservablePersistence({ persistLocal: ObservablePersistMMKV });
}
