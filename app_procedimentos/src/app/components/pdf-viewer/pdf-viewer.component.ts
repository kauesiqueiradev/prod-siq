import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent implements OnInit{
  @Input() pdfUrl: string ='';
  @Input() folderName: string ='';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // this.route.url.subscribe(segments => {
    //   const filePath = segments.map(segment => segment.path).join('/');
    //   // this.pdfUrl = `assets/${filePath}`;
    //   this.pdfUrl = `/static-files/${encodeURIComponent(this.folderName)}/1.%20Ativos/1.%20Procedimentos/${encodeURIComponent(filePath)}`
    // });
    this.route.queryParams.subscribe(params => {
      const folderName = params['folderName'];
      const pdfPath = params['pdfPath'];
      if (folderName && pdfPath) {
        this.pdfUrl = `/static-files/${folderName}${pdfPath}`
      }
    })
  }
}