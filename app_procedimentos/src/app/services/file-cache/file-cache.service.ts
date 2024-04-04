import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileCacheService {
  private cachedFiles: { [url: string]: Blob} = {};

  constructor(private http: HttpClient) { }

  getFile(fileUrl: string): Observable<Blob> {
    if (this.cachedFiles[fileUrl]) {
      // console.log('Testando');
      return of(this.cachedFiles[fileUrl]);
    } else {
      return new Observable<Blob>((observer) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', fileUrl);
        xhr.responseType = 'blob';
        xhr.onload = () => {
          if (xhr.status === 200) {
            const blob = xhr.response;
            this.cachedFiles[fileUrl] = blob;
            observer.next(blob);
            observer.complete();
          } else {
            observer.error(`Erro ao buscar o arquivo ${fileUrl}: ${xhr.statusText}`);
          }
        };
        xhr.onerror = () => {
          observer.error(`Erro ao buscar o arquivo ${fileUrl}: ${xhr.statusText}`);
        };
        xhr.send();
      });
    } 
  }

  isFileCached(fileUrl: string): boolean {
    return !!this.cachedFiles[fileUrl];
  }

  getCachedFile(fileUrl: string): Blob | null {
    return this.cachedFiles[fileUrl] || null;
  }

  cacheFile(fileUrl: string): Observable<Blob> {
    return this.getFile(fileUrl);
  }
}
