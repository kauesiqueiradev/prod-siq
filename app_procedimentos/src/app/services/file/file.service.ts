import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = 'http://localhost:3000/ficha/files'
  // private apiUrl = 'http://siq.grupotecnotextil.com:3000/ficha/files';

  constructor(private http: HttpClient) { }

  getFiles():Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        response.files = response.files.map((file: any) => ({
          ...file,
          filepath: `${this.apiUrl}/${file.filename}`
        }));
        return response;
      })
    );
  }

  searchFiles(query: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/?query=${query}`);
  }

  getFile(fileName: string): Observable<Blob> {
    console.log('FileName:', fileName);
    return this.http.get(`${this.apiUrl}/${fileName}`, { responseType: 'blob' });
}
}
