import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Card } from 'src/app/interface/card';
import { DataService, FileData } from 'src/app/data/data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FileCacheService } from 'src/app/services/file-cache/file-cache.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PdfModalComponent } from 'src/app/components/pdf-modal/pdf-modal.component';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})

export class CardComponent implements OnInit{
  itensPorPagina = 8;
  paginaAtual = 1;

  type: string = '';
  cards: Card[] = [] ;
  folderName: string = '';
  files: FileData[] = [];
  errorMessage: string = '';

  bsModalRef!: BsModalRef;

  constructor(
    private route: ActivatedRoute, 
    private folderService: DataService, 
    private router: Router, 
    private sanitizer: DomSanitizer, 
    private fileCacheService: FileCacheService,
    private modalService: BsModalService,
  ) { }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.folderName = params['folderName'];
      this.getFiles(this.folderName);
    })
  }

  getFiles(folder: string): void {
    this.folderService.getFiles(folder).subscribe(
      (data: any) => {
        // console.log("data:", data);
        if (data && data.files && Array.isArray(data.files) && data.files.length > 0) {
          // Verificar se há arquivos PDF na pasta
          const pdfFiles = data.files.filter((fileData: { fileName: string; }) => {
            return fileData.fileName.toLowerCase().endsWith('.pdf');
          });
  
          if (pdfFiles.length > 0) {
            this.files = pdfFiles;
          } else {
            this.files = [];
            this.errorMessage = "Não há arquivos PDF nesta pasta.";
          }
        } else {
          this.files = [];
          if (data && data.error === 'Erro ao ler a pasta') {
            this.errorMessage = "A pasta não existe.";
          } else {
            this.errorMessage = "Essa pasta não contém a pasta: 1. Ativos:";
          }
        }
      },
      error => {
        console.error('Erro ao buscar arquivos:', error);
        this.files = [];
        this.errorMessage = "Essa pasta não contém a pasta: 1. Ativos:.";
      }
    );
  }
 
  openPdfFile(fileUrl: string): void {
     // Verifica se o arquivo é um PDF
     if (!fileUrl.toLowerCase().endsWith('.pdf')) {
      console.error('O arquivo não é um PDF:', fileUrl);
      return;
    }
      // Verifica se o arquivo já está em cache
    if (this.fileCacheService.isFileCached(fileUrl)) {
      // Se estiver em cache, abre o arquivo a partir do cache
      const cachedFile = this.fileCacheService.getCachedFile(fileUrl);
      if (cachedFile) {
        const pdfUrl = URL.createObjectURL(cachedFile);
        this.openPdfModal(pdfUrl);
        // window.open(pdfUrl, '_blank');
      } else {
        console.error('O arquivo não está em cache:', fileUrl);
      }
    } else {
      // Se não estiver em cache, baixa o arquivo e o armazena em cache antes de abrir
      this.fileCacheService.cacheFile(fileUrl).subscribe(
        (file: Blob) => {
          const pdfUrl = URL.createObjectURL(file);
          // window.open(fileURL, '_blank');
          this.openPdfModal(pdfUrl);
        },
        (error: any) => {
          console.error('Erro ao abrir o arquivo:', error);
        }
      );
    }
  }

  openPdfModal(pdfUrl: string): void {
    console.log("PDF no card:", pdfUrl);

    const initialState = {
      cachedFile:  pdfUrl
    };
    this.bsModalRef = this.modalService.show(PdfModalComponent, { initialState });
  }

  getPaginaArquivos(): any[] {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    return this.cards.slice(inicio, fim);
  }

  getTotalPaginas(): number {
    return Math.ceil(this.cards.length / this.itensPorPagina);
  }

  goBackToProcedures() {
    this.router.navigate(['/home/procedures']);
  }
}