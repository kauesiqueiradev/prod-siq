import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileService } from 'src/app/services/file/file.service';

@Component({
  selector: 'app-technical-sheet',
  templateUrl: './technical-sheet.component.html',
  styleUrls: ['./technical-sheet.component.css']
})
export class TechnicalSheetComponent implements OnInit {
  files: { filename: string; filepath: string}[] = [];
  filteredFiles: { filename: string; filepath: string}[] = [];
  searchQuery: string = '';
  selectedFile: string | null = null;
  pdfUrl: any
  errorMessage: string = '';

  @ViewChild('content') popupview !: ElementRef;

  constructor(private fileService: FileService, private sanitizer: DomSanitizer, private modalservice: NgbModal,) { }

  ngOnInit(): void {
      this.loadFiles();
  }

  loadFiles(): void {
    this.fileService.getFiles().subscribe(
      (response) => {
        this.files = response.files;
        this.filteredFiles = [...this.files];
      },
      (error) => {
        console.error('Erro ao carregar arquivos:', error);
      }
    );
  }

  filterFiles(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredFiles = this.files.filter((file) => 
      file.filename.toLowerCase().includes(query)
    );
  }

  // selectFile(filePath: string): void {
  //   this.selectedFile = filePath;
  // }

  selectFile(filePath: string): void {
    const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(filePath);

    // Converta o SafeResourceUrl para string
    this.pdfUrl = filePath;  // Não adicione prefixo se for URL completa
    if (this.pdfUrl) {
        this.modalservice.open(this.popupview, { fullscreen: true, animation: true });
    } else {
        console.error('Erro: URL do PDF inválida');
    }
}

  goBack(): void {
    this.selectedFile = null; // Retorna para a lista de arquivos
  }
  // searchFiles(): void {
  //   if (!this.searchQuery.trim()) {
  //     this.loadFiles();
  //     return;
  //   }

  //   this.fileService.searchFiles(this.searchQuery).subscribe(
  //     (response) => {
  //       this.files = response.files;
  //     },
  //     (error) => {
  //       console.error('Erro ao buscar arquivos:', error);
  //     }
  //   )
  // }
}
