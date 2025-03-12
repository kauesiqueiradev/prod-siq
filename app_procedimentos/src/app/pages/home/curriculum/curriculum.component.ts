import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-curriculum',
  templateUrl: './curriculum.component.html',
  styleUrls: ['./curriculum.component.css']
})
export class CurriculumComponent implements OnInit{
  formData = {
    nome: '',
    cargoPretendido: '',
    setor: '',
    cargoAtual: '',
    areaAtual: '',
    gestorImediato: '',
    lider: '',
    dataAdmissao: '',
    horarioTrabalho: '',
    matricula: '',
    advertencias: '',
    motivo: '',
    dataAtual: ''
  };

  isLoading = false;

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      this.formData.nome = parsedUser.nome || '';
      this.formData.matricula = parsedUser.mat || '';
    }

    this.route.queryParams.subscribe(params => {
      if (params['vaga']) {
        const vaga = JSON.parse(params['vaga']);
        this.formData.cargoPretendido = vaga.cargoPretendido;
        this.formData.setor = vaga.setor;
      }
    });
    this.formData.dataAtual = this.getCurrentDateTime();

    this.fetchUserData();
  }

  fetchUserData():void {
    if (!this.formData.matricula) {
      console.warn('Matrícula não encontrada, não foi possível buscar os dados.');
      return;
    } 

    this.isLoading = true;
    const apiUrl = `http://172.16.50.12:9002/rest/WSFUNCIO/retfunc?empresa=040&matfunc=${this.formData.matricula}`;

    this.http.get<any[]>(apiUrl)
    .pipe(
      catchError(error => {
        console.error('Erro ao buscar dados do usuário:', error);
        return of( [] ); 
      })
    )   
    .subscribe(
      response => {
        this.isLoading = false;
        if (response.length > 0) {
          const userData = response[0];
          this.formData = {
            ...this.formData,
            nome: userData.nome || this.formData.nome,
            cargoAtual: userData.desfuncao || '',
            areaAtual: userData.descusto || '',
            gestorImediato: '', // Se houver na API, preencher aqui
            lider: '', // Se houver na API, preencher aqui
            dataAdmissao: userData.admissao || '',
            horarioTrabalho: userData.desturno || '',
            matricula: userData.matricula || this.formData.matricula
          };
          console.log('dados api:', userData);
        }
      });
      console.log('dados do usuário:', this.formData);
    }

  enviarCurriculo(): void {
    // console.log('Currículo enviado:', this.formData);
    const formEnvioData = {
      nome: this.formData.nome,
      mat: this.formData.matricula,
      cargoatual: this.formData.cargoAtual,
      areaatual: this.formData.areaAtual,
      gestor: this.formData.gestorImediato,
      lider: this.formData.lider,
      dataadmi: this.formData.dataAdmissao,
      hrtrabalho: this.formData.horarioTrabalho,
      datainsc: this.formData.dataAtual,
      advertencia: this.formData.advertencias,

      // email: this.formData.email,
      // fone: this.formData.telefone,

      cargopre: this.formData.cargoPretendido,
      areapre: this.formData.setor,

      resumo: this.formData.motivo,

      decok: this.formData.motivo
    };

    const apiUrl = 'http://177.54.187.183:9002/REST/WSCURRIC';

    this.http.post(apiUrl, formEnvioData, { responseType: 'text' })
      .pipe(
        catchError(error => {
          console.error('Erro ao enviar currículo:', error);
          alert('Erro ao enviar currículo. Tente novamente.');
          return of(null);
        })
      )
      .subscribe(response => {
        if (response) {
          alert('Currículo enviado com sucesso!');
          this.router.navigate(['home/vacancy']);
        }
      });

    // alert(`dados do Curriculo, ${formEnvioData}`);
    // alert('Currículo enviado com sucesso!');
    // this.router.navigate(['home/vacancy']);
  }

  voltarParaVagas() {
    this.router.navigate(['home/vacancy']);
  }

  getCurrentDateTime(): string {
    const now = new Date();
    return now.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  }
}