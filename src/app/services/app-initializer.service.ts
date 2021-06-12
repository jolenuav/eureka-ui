import { Injectable } from '@angular/core';
import { StoreService } from './store.service';

@Injectable()
export class AppInitializerService {
  constructor(private store: StoreService) {}

  async load(): Promise<void> {
    await this.store.initialApp();
  }
}
