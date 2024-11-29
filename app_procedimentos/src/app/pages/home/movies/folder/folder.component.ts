import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.css']
})

export class FolderComponent implements OnInit {
  currentPath: string = '';
  parentPath: string | null = null;
  contents: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadFolder(); // Carrega o diretório raiz
  }

  loadFolder(path: string = ''): void {
    this.http.get<any>(`http://localhost:3000/movies/get-folders`, { params: { path } }).subscribe(
      data => {
        this.currentPath = data.currentPath;
        this.parentPath = data.parentPath;
        this.contents = data.contents;
      },
      error => console.error('Erro ao carregar pastas:', error)
    );
  }

  playVideo(videoPath: string): void {
    window.open(`http://localhost:3000/movies/play-video?path=${encodeURIComponent(videoPath)}`, '_blank');
  }

  goBack(): void {
    if (this.parentPath) {
      this.loadFolder(this.parentPath);
    }
  }
}