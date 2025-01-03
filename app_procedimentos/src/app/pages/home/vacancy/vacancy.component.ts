import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { catchError, debounceTime, of } from 'rxjs';

@Component({
  selector: 'app-vacancy',
  templateUrl: './vacancy.component.html',
  styleUrls: ['./vacancy.component.css']
})
export class VacancyComponent implements OnInit {
  vagas: any[] = [];
  vagasFiltradas: any[] = [];
  cidades: string[] = ['Três Pontas', 'Varginha', 'Monsenhor Paulo'];
  setores: string[] = [];
  searchTerm: string = '';
  selectedCity: string = '';
  selectedSetor: string = '';
  vagaSelecionada: any = null;
  selectedOrder: string = 'dateNewest';
  isLoading: boolean = true;
  currentPage: number = 1;
  itemsPerPage: number = 9;
  private touchStartX: number = 0;
  exibirFormulario: boolean = false;
  usuarioLogado: any;

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = localStorage.getItem('currentUser');

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);

        if (parsedUser && parsedUser.nome) {
          const firstSpaceIndex = parsedUser.nome.indexOf(' ');
          if (firstSpaceIndex !== -1) {
            this.usuarioLogado = parsedUser.nome.substring(0, firstSpaceIndex);
          }
        } 
      } catch (error) {
        console.error('Erro ao analisar os dados do usuário no localStorage:', error);
      }
    }  else {
     
    }
    
  }

  ngOnInit(): void {
    this.fetchVacancies();
    this.searchTermChanged();
  }

  fetchVacancies(): void {
    this.isLoading = true;
    this.http.get<{ objects: any[] }>('http://172.16.50.9:9104/rest/ZWS_SQS/get_interna?')
    .pipe(
      catchError(error => {
        console.error('Erro ao buscar vagas:', error);
        return of({ objects: [] }); 
      })
    )   
    .subscribe(response => {
      this.vagas = response.objects.map(vaga => ({
        ...vaga,
        cidade: this.mapCity(vaga.empresa),
        data: vaga.dtabert
      }));
      this.vagas = this.vagas.sort((a: any, b: any) => b.data.localeCompare(a.data));
      this.vagasFiltradas = [...this.vagas];
      this.populateFilters();
      this.isLoading = false;
    }, () => {
      this.isLoading = false;
    }); 
  }

  searchTermChanged() {
    this.http.get<{ objects: any[] }>('http://172.16.50.9:9104/rest/ZWS_SQS/get_interna?')
      .pipe(
        debounceTime(300),
        catchError(error => {
          console.error('Erro ao buscar vagas:', error);
          return of({ objects: [] });
        })
      )
      .subscribe(response => {
        this.vagas = response.objects;
        this.filterVagas();
      });
  }

  mapCity(empresa: string): string {
    const mapping: { [ key: string]: string } = {
      '1': 'Três Pontas',
      '2': 'Varginha',
      '3': 'Monsenhor Paulo'
    };
    return mapping[empresa] || 'Cidade não informada';
  }

  populateFilters(): void {
    this.setores = [...new Set(this.vagas.map(vaga => vaga.cc))];
  }

  filterVagas() {
    this.vagasFiltradas = this.vagas.filter(vaga => {
      const matchesSearch = this.searchTerm
        ? vaga.descric.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;
      const matchesCity = this.selectedCity
        ? vaga.cidade === this.selectedCity
        : true;
      const matchesSetor = this.selectedSetor
        ? vaga.cc === this.selectedSetor
        : true;
  
      return matchesSearch && matchesCity && matchesSetor;
    });
  
    if (this.selectedOrder === 'dateNewest') {
      this.vagasFiltradas.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    } else if (this.selectedOrder === 'dateOldest') {
      this.vagasFiltradas.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
    } else if (this.selectedOrder === 'alphabetical') {
      this.vagasFiltradas.sort((a, b) => a.descric.localeCompare(b.descric));
    }
  }

  openModal(vaga: any): void {
    this.vagaSelecionada = vaga;
    const modalElement = document.getElementById('detalhesModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  candidatarVaga(vaga: any): void {
    alert(`Você se candidatou para a vaga: ${vaga.descric}`);
  }

  get paginatedVagas(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.vagasFiltradas.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.vagasFiltradas.length / this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
  }
  
  onTouchEnd(event: TouchEvent): void {
    const touchEndX = event.changedTouches[0].clientX;
    const deltaX = this.touchStartX - touchEndX;
  
    const threshold = 50; 
    if (deltaX > threshold) {
      this.goToNextPage(); 
    } else if (deltaX < -threshold) {
      this.goToPreviousPage();
    }
  }

  abrirFormulario(): void {
    this.exibirFormulario = true;
  }

  fecharFormulario(event: any): void {
    this.exibirFormulario = false;
    alert('Currículo enviado com sucesso!');
  }

  redirecionarParaCurriculo(vaga: any): void {
    if (vaga) {
      this.router.navigate(['home/curriculum'], {
        queryParams: {
          vaga: JSON.stringify({
            cargoPretendido: vaga.descric,
            setor: vaga.cc
          })
        }
      });
    }
  }
}
