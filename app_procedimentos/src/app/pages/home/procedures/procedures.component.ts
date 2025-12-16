import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DataService } from 'src/app/data/data.service';

@Component({
  selector: 'app-procedures',
  templateUrl: './procedures.component.html',
  styleUrls: ['./procedures.component.css']
})
// export class ProceduresComponent {
//   folders:  { name: string, icon: string }[] = [];
//   selectedFolder: string = '';
//   files: string[]= [];

//   public sectors: { icon: string, name: string }[]= [];

//   pag : number = 1;
//   count: number = 8;
//   columns: number = 1;
//   icons: any;

//   constructor(private router: Router, private folderService: DataService, private route: ActivatedRoute) {
//     // console.log('Carregando dados....');
//   }

//   ngOnInit() {
//     this.checkScreenWidth();
//     this.loadIcons();
//     // this.getCompanies();
//     this.getFolders();
//   }

//   @HostListener('window:resize', ['$event'])
//   onResize(event: any) {
//     this.checkScreenWidth();
//   }

//   private checkScreenWidth() {
//     const screenWidth = window.innerWidth;
//     const tabletWidth = 768;
//     const deskWidth = 1024;
//     const mobileColumns = 1;
//     const desktopMinColumns = 3;
//     const desktopColumns = 4; // Número de colunas para desktop

//     if (screenWidth >= deskWidth) {
//       this.columns = screenWidth >= tabletWidth ? desktopColumns : 1;
//       this.count = this.columns === 4 ? 16 : 12;
//     } else if (screenWidth >= tabletWidth) {
//       this.columns = desktopMinColumns;
//       this.count = 12;
//     } else {
//       this.columns = mobileColumns;
//       this.count = 8;
//     }

//   }

//   get columnsTemplate(): string {
//     return `repeat(${this.columns}, 1fr)`;
//   }

//   // getCompanies() {
//   //   this.folderService.getCompanies().subscribe(
//   //     data => {
//   //       // console.log('Dados recebidos do serviço:', data);
//   //       this.folders = data.folders.filter((folder: string) => {
//   //         return !folder.match(/ARQUIVO MORTO|Auditoria de Artes \(Líderes\)/i);
//   //       }).map((folder: string, index: number) => {
//   //         if (this.sectors[index]) {
//   //           return { name: folder, iconUrl: this.sectors[index].icon };
//   //         } else {
//   //           return { name: folder, iconUrl: '' }; // Ou uma URL padrão de ícone de fallback
//   //         }
//   //       });
//   //       // console.log('Pastas filtradas:', this.folders);
//   //     },
//   //     error => {
//   //       console.error("Erro ao buscar pastas principais:", error);
//   //     }
//   //   );
//   // }

//   getFolders() {
//     this.folderService.getFolder().subscribe(
//       data => {
//         // console.log('Dados recebidos do serviço:', data);
//         this.folders = data.folders.filter((folder: string) => {
//           return !folder.match(/ARQUIVO MORTO|Auditoria de Artes \(Líderes\)/i);
//         }).map((folder: string, index: number) => {
//           if (this.sectors[index]) {
//             return { name: folder, iconUrl: this.sectors[index].icon };
//           } else {
//             return { name: folder, iconUrl: '' }; // Ou uma URL padrão de ícone de fallback
//           }
//         });
//         // console.log('Pastas filtradas:', this.folders);
//       },
//       error => {
//         console.error("Erro ao buscar pastas principais:", error);
//       }
//     );
//   }

//   openSectorsFolder(folderName: string) {
//       this.router.navigate(['/home/procedures', folderName]);
//   }
  
//   openCardFolder(folderName: string) {
//       this.router.navigate(['/home/procedures', folderName]);
//   }

//   loadIcons(): void {
//     this.folderService.getIcons().subscribe(icons => {
//       this.icons = icons; // Alteração aqui: atribuir os ícones para a propriedade correta (this.icons)
//     });
//   }

//   getIconUrl(cardName: string): string {
//     const similarIcon = this.icons.find((icon: { name: string; }) => cardName.toLowerCase().includes(icon.name.toLowerCase()));
//     return similarIcon ? similarIcon.icon : ''; // Retorna o URL do ícone se encontrado, senão retorna uma string vazia
//   }

// }
export class ProceduresComponent implements OnInit{
  empresas: string[] = []; // Lista de empresas
  setores: { [empresa: string]: string[] } = {}; // Lista de setores por empresa
  empresaSelecionada: string | null = null; // Empresa selecionada para exibir os setores
  exibindoSetores = false;
  iconsMap: Map<string, string> = new Map();

  public sectors: { icon: string, name: string }[]= [];

  pag : number = 1;
  count: number = 8;
  columns: number = 1;
  icons: any;
  isLoading = false;

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.getEmpresas();
    this.loadIcons();
    this.checkScreenWidth();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenWidth();
  }

  private checkScreenWidth() {
    const screenWidth = window.innerWidth;
    const tabletWidth = 768;
    const deskWidth = 1024;
    const mobileColumns = 1;
    const desktopMinColumns = 3;
    const desktopColumns = 4; // Número de colunas para desktop

    if (screenWidth >= deskWidth) {
      this.columns = screenWidth >= tabletWidth ? desktopColumns : 1;
      this.count = this.columns === 4 ? 16 : 12;
    } else if (screenWidth >= tabletWidth) {
      this.columns = desktopMinColumns;
      this.count = 12;
    } else {
      this.columns = mobileColumns;
      this.count = 8;
    }
  }

  get columnsTemplate(): string {
    return `repeat(${this.columns}, 1fr)`;
  }

  getEmpresas(): void {
    this.isLoading = true;

    this.dataService.getEmpresas().subscribe({
      next: (data: any) => {
        this.empresas = data.companies || [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  getSetores(empresa: string): void {
    this.empresaSelecionada = empresa;
    this.exibindoSetores = true;
    this.isLoading = true;

    if (!this.setores[empresa]) {
      this.dataService.getSetores(empresa).subscribe({
        next: (data: any) => {
          this.setores[empresa] = data.sectors || [];
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  voltarParaEmpresas(): void {
    this.exibindoSetores = false;
    this.empresaSelecionada = null;
  }

  abrirSetor(empresa: string, setor: string): void {
    this.router.navigate(['/home/procedures', empresa, setor]); // Redireciona para a lista de PDFs do setor
  }

  loadIcons(): void {
    this.dataService.getIcons().subscribe(icons => {
      this.icons = icons; // Alteração aqui: atribuir os ícones para a propriedade correta (this.icons)

      this.icons.forEach((icon: { name: string; icon: string }) => {
        this.iconsMap.set(icon.name.toLowerCase(), icon.icon);
      });
    });
  }

  trackByFn(index: number, item: any): any {
    return item; // ou item.id se houver
  }

  getIconUrl(cardName: string): string {
    const normalize = (str: string) =>
      str
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/^\d+\.\s*/, '') // Remove prefixos numéricos "1. "
        .toLowerCase();
  
    const normalizedCardName = normalize(cardName);
  
    const similarIcon = this.icons.find((icon: { name: string }) =>
      normalize(icon.name).includes(normalizedCardName)
    );
  
    return similarIcon ? similarIcon.icon : 'assets/icons/default.png';
  }
  
  // getIconUrl(cardName: string): string {
  //   const similarIcon = this.icons.find((icon: { name: string; }) => cardName.toLowerCase().includes(icon.name.toLowerCase()));
  //   return similarIcon ? similarIcon.icon : 'assets/icons/default.png'; // Retorna o URL do ícone se encontrado, senão retorna uma string vazia
  // }
}