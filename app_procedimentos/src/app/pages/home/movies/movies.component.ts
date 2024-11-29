import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MoviesService } from 'src/app/services/movies/movies.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit {
  // folders: any[] = [];
  // selectedVideo: any = null;
  // constructor(private moviesService: MoviesService) { }

  // ngOnInit(): void {
  //     this.loadFolders();
  // }

  // loadFolders(): void {
  //   this.moviesService.getFolders().subscribe({
  //     next: (data) => {
  //       this.folders = data.folders || [];
  //     },
  //     error: (err) => {
  //       console.log('Erro ao carregar pastas:', err);
  //     }
  //   });
  // }

  // selectVideo(video: any): void {
  //   this.selectedVideo = video;
  // }
  currentPath: string = '';
  parentPath: string | null = null;
  contents: any[] = [];
  selectedVideoPath: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadFolder();
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
    this.selectedVideoPath = videoPath;
    // window.open(`http://localhost:3000/movies/play-video?path=${encodeURIComponent(videoPath)}`, '_blank');
  }

  goBack(): void {
    if (this.parentPath) {
      this.loadFolder(this.parentPath);
    }
  }
  closeVideo(): void {
    this.selectedVideoPath = null; // Fecha o reprodutor de vídeo
  }
}




// export class MoviesComponent {
//   videos = [
//     {
//       title: 'Vídeo 1',
//       description: 'Este é o primeiro vídeo de demonstração.',
//       url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
//     },
//     {
//       title: 'Vídeo 2',
//       description: 'Este é o segundo vídeo de demonstração.',
//       url: 'https://www.youtube.com/embed/9bZkp7q19f0',
//     },
//     {
//       title: 'Vídeo 3',
//       description: 'Este é o terceiro vídeo de demonstração.',
//       url: 'https://www.youtube.com/embed/3JZ_D3ELwOQ',
//     },
//   ];

//    // Vídeo atualmente selecionado
//    selectedVideo: any = null;

//    // Alterna o vídeo entre normal e expandido
//    toggleVideo(video: any) {
//      this.selectedVideo = this.selectedVideo === video ? null : video;
//    }
// }
