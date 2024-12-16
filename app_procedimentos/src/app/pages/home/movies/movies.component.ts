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
  noVideosMessage: string | null = null;

  constructor(private moviesService: MoviesService) {}

  ngOnInit() {
    this.loadFolder('');
  }

  async loadFolder(path: string) {
    try {
      this.loading = true;
      this.error = null;
      this.noVideosMessage = null;
      this.currentFolder = await this.moviesService.getFolders(path).toPromise();
      
      if (this.currentFolder) {
        const hasVideos = this.currentFolder.contents.some(item => this.isVideo(item));
        const hasFolders = this.currentFolder.contents.some(item => this.isFolder(item));
        if (!hasVideos && !hasFolders) {
          this.noVideosMessage = 'Não há vídeos para exibir;'
        }
      }
      
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

  playVideo(video: VideoItem) {
    // this.currentVideoUrl = this.moviesService.playVideo(video.path);
    this.currentVideoUrl = this.getVideoUrl(video);
    console.log('Video URL:', video.path);
    this.isModalOpen = true;

    const videoElement = document.querySelector('video') as HTMLVideoElement;

    if (videoElement) {
      // Garantir que o vídeo seja mudo enquanto no estado compacto
      videoElement.muted = true;
    }
  }

  getVideoUrl(video: VideoItem): string {
    // Usa o serviço para construir a URL do vídeo
    return this.moviesService.playVideo(video.path);
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

    const videoElement = document.querySelector('video') as HTMLVideoElement;
    if (videoElement) {
      videoElement.muted = true;  // Silencia o áudio ao fechar o modal
    }
  }
}


// getVideoThumbnail(video: VideoItem): string {
  //   // Aqui você pode implementar a lógica para gerar/obter thumbnails dos vídeos
  //   // Por enquanto, usaremos uma imagem placeholder
  //   return 'assets/video-thumbnail-placeholder.jpg';
  // }


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
