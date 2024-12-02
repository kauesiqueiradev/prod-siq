import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { response } from 'express';
import { MoviesService } from 'src/app/services/movies/movies.service';


interface VideoItem {
  name: string;
  type: 'video';
  path: string;
}

interface FolderItem {
  name: string;
  type: 'folder';
}

type ContentItem = VideoItem | FolderItem;

interface FolderContent {
  currentPath: string;
  parentPath: string | null;
  contents: ContentItem[];
}

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit {
  currentFolder: FolderContent | null = null;
  breadcrumbs: string[] = [];
  loading = false;
  error: string | null = null;
  isModalOpen = false;
  currentVideoUrl = '';

  private moviesUrl = "http://localhost:3000";

  constructor(private moviesService: MoviesService) {}

  ngOnInit() {
    this.loadFolder('');
  }

  async loadFolder(path: string) {
    try {
      this.loading = true;
      this.error = null;
      this.currentFolder = await this.moviesService.getFolders(path).toPromise();
      this.updateBreadcrumbs(path);
    } catch (err) {
      this.error = 'Erro ao carregar a pasta';
      console.error(err);
    } finally {
      this.loading = false;
    }
  }

  private updateBreadcrumbs(path: string) {
    if (!path) {
      this.breadcrumbs = [];
      return;
    }
    this.breadcrumbs = path.split('/').filter(Boolean);
  }

  navigateToFolder(folderName: string) {
    const newPath = this.currentFolder?.currentPath
      ? `${this.currentFolder.currentPath}/${folderName}`
      : folderName;
    this.loadFolder(newPath);
  }

  navigateBack() {
    if (this.currentFolder?.parentPath !== null) {
      this.loadFolder(this.currentFolder?.parentPath || '');
    }
  }

  getVideoThumbnail(video: VideoItem): string {
    // Aqui você pode implementar a lógica para gerar/obter thumbnails dos vídeos
    // Por enquanto, usaremos uma imagem placeholder
    return 'assets/video-thumbnail-placeholder.jpg';
  }

  playVideo(video: VideoItem) {
    // Implementar a lógica de reprodução do vídeo
    this.currentVideoUrl = `${this.moviesUrl}/movies/play-video?path=${encodeURIComponent(video.path)}`;
    this.isModalOpen = true;
  }

  isVideo(item: ContentItem): item is VideoItem {
    return item.type === 'video';
  }

  isFolder(item: ContentItem): item is FolderItem {
    return item.type === 'folder';
  }

  closeVideoModal() {
    this.isModalOpen = false;
    this.currentVideoUrl = '';
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
