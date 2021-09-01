import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  collection = 'categories';

  constructor(private fireStorage: AngularFireStorage) {}

  async upload(file: File, path: string): Promise<string> {
    if (!file) {
      return;
    }
    // The storage path
    // const path = `commerces/prueba/productos`;
    // Reference to storage bucket
    const ref = this.fireStorage.ref(path);
    // The main task
    await this.fireStorage.upload(path, file);
    const downloadURL = await ref.getDownloadURL().toPromise();
    return downloadURL;
  }
  async delete(downloadURL: string): Promise<void> {
    this.fireStorage.storage.refFromURL(downloadURL).delete();
  }
}
