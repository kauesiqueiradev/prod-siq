import { Component, ElementRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-pdf-modal',
  templateUrl: './pdf-modal.component.html',
  styleUrls: ['./pdf-modal.component.css']
})
export class PdfModalComponent {
  cachedFile: string = '';

  constructor(public bsModalRef: BsModalRef, private elementRef: ElementRef) { }

  ngOnInit() {

    console.log("PDF:", this.cachedFile);

    const iframe = this.elementRef.nativeElement.querySelector('iframe');
    iframe.onload = () => {
      console.log('PDF carregado');
    }
  }

}
