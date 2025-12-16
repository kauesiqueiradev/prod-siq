import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Card } from 'src/app/interface/card';
import { DataService, FileData } from 'src/app/data/data.service';
import { FileCacheService } from 'src/app/services/file-cache/file-cache.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})

export class CardComponent implements OnInit{
  itensPorPagina = 8;
  paginaAtual = 1;

  pdfUrl: any

  type: string = '';
  cards: Card[] = [] ;
  folderName: string = '';
  files: FileData[] = [];
  errorMessage: string = '';
  selectedFileName: string = '';
  empresa: string = '';
  isLoading: boolean = false;

  @ViewChild('content') popupview !: ElementRef;

  constructor(
    private route: ActivatedRoute, 
    private folderService: DataService, 
    private router: Router, 
    private modalservice: NgbModal,
  ) { }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      // this.folderName = params['folderName'];
      // this.getFiles(this.folderName);
      this.empresa = params['empresa'];
      const setor = params['setor'];
      this.folderName = setor; 
      this.isLoading = true;
      setTimeout(() => {
        this.getFiles(this.empresa, setor);
      });
    })
  }

  getFiles(empresa: string, setor: string): void {
    console.log('Parâmetros:', empresa, setor);
    
    this.folderService.getFiles(empresa, setor).subscribe(
      (data: any) => {
        if (data && data.files && Array.isArray(data.files) && data.files.length > 0) {
          const pdfFiles = data.files.filter((fileData: { fileName: string; }) =>
            fileData.fileName.toLowerCase().endsWith('.pdf')
          );
  
          this.files = pdfFiles.length > 0 ? pdfFiles : [];
          this.errorMessage = pdfFiles.length > 0 ? '' : "Não há arquivos PDF nesta pasta.";
        } else {
          this.files = [];
          this.errorMessage = data?.error === 'Erro ao ler a pasta'
            ? "A pasta não existe."
            : "Essa pasta não contém a pasta: Arquivos PDFs!";
        }
        this.isLoading = false; // Fim do carregamento
      },
      error => {
        console.error('Erro ao buscar arquivos:', error);
        this.files = [];
        this.errorMessage = "Essa pasta não contém a pasta: Arquivos PDFs!";
        this.isLoading = false; // Fim do carregamento mesmo com erro
      }
    );
  }



  PreviewInvoice(empresa: string, setor: string, fileName: string) {
    console.log('Parâmetros:', empresa, setor, fileName);
    this.isLoading = true;
    this.folderService.GenerateInvoicePDF(empresa, setor, fileName).subscribe({
      next: (res: any) => {
        let blob: Blob = res.body as Blob;
        let url = window.URL.createObjectURL(blob);
        this.pdfUrl = url;
        this.selectedFileName = fileName;
  
        this.modalservice.open(this.popupview, { fullscreen: true, animation: true });
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erro ao gerar o PDF da fatura:', error);
        this.isLoading = false;
      }
    });
  }

  getPaginaArquivos(): any[] {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    return this.cards.slice(inicio, fim);
  }

  getTotalPaginas(): number {
    return Math.ceil(this.cards.length / this.itensPorPagina);
  }

  goBackToProcedures(): void {
    this.router.navigate(['/home/procedures']);
  }
}