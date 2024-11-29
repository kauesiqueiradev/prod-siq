import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  private moviesUrl = "http://localhost:3000/movies/get-folders";

  constructor(private http: HttpClient) { }


  getFolders(): Observable<any> {
    return this.http.get(`${this.moviesUrl}`);
  }
}
