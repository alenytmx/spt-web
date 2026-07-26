import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PdfService {

  private apiUrl = 'http://localhost:3000/api/pdf';
  constructor(private http: HttpClient) {}

  generarPdfOrden(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}`, {
      responseType: 'blob'
    });
  }
}
