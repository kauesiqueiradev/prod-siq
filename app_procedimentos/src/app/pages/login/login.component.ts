import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { LoginAuthService } from 'src/app/services/login-auth/login-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{
  cpfOrMat: string = '';
  cpfOrMatInvalid: boolean = false;
  isLoading: boolean = false;

  constructor(private authService: LoginAuthService, private router: Router) {}

  validarCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, ''); // Remove qualquer caractere não numérico
    if (cpf.length !== 11) return false; // Verifica se o CPF tem 11 dígitos
    if (/^(\d)\1{10}$/.test(cpf)) return false; // Verifica se o CPF tem todos os números iguais

    let soma = 0;
    let resto: number;
    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpf.charAt(i - 1)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpf.charAt(i - 1)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;

    return true; // CPF válido
  }

  login() {
    if (this.cpfOrMat.trim().length === 0) {
      this.cpfOrMatInvalid = true; 
      return; 
    }

    if (this.cpfOrMat.length === 11 && !this.validarCPF(this.cpfOrMat)) {
      this.cpfOrMatInvalid = true;
      return;
    }

    this.isLoading = true; 

    this.authService.login(this.cpfOrMat).subscribe({
      next: (user) => {
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.router.navigate(['/home']);
        } else {
          if (this.cpfOrMat.length === 11 && this.validarCPF(this.cpfOrMat)) {
            const visitorUser = { role: 'Visitante', cpfOrMat: this.cpfOrMat };
            localStorage.setItem('currentUser', JSON.stringify(visitorUser));
            this.router.navigate(['/home']);
          } else {
            this.cpfOrMatInvalid = true;
          }
        }
        this.cpfOrMat = '';
      },
      error: (error) => {
        console.error('Erro ao realizar login:', error);
        // console.log('Erro 1er')
      },
      complete: () => {
        this.isLoading = false; 
        this.cpfOrMat = '';
      }
    });
  }
}
