import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  // private moviesUrl = "http://localhost:3000/movies";
  private moviesUrl = 'http://siq.grupotecnotextil.com:3000/movies';

  constructor(private http: HttpClient) { }


  getFolders(path: string): Observable<any> {
    return this.http.get(`${this.moviesUrl}/get-folders`, {
      params: { path }
    });
  }

  playVideo(path: string): string {
    // Constrói a URL para reprodução do vídeo com o path fornecido
    return `${this.moviesUrl}/play-video?path=${encodeURIComponent(path)}`;
  }
}
