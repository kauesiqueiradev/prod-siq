import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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

  constructor(private route: ActivatedRoute, private router: Router) {}

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
  }

  enviarCurriculo(): void {
    // console.log('Currículo enviado:', this.formData);
    alert('Currículo enviado com sucesso!');
    this.router.navigate(['home/vacancy']);
  }

  voltarParaVagas() {
    this.router.navigate(['home/vacancy']);
  }

  getCurrentDateTime(): string {
    const now = new Date();
    return now.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  }
}