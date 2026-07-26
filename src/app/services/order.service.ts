import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrdenServicio } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrdenServicioService {

  private apiUrl = 'http://localhost:3000/api/order';

  constructor(private http: HttpClient) {}

  getOrdenes(): Observable<OrdenServicio[]> {
    return this.http.get<OrdenServicio[]>(this.apiUrl);
  }

  getOrden(id: string): Observable<OrdenServicio> {
    return this.http.get<OrdenServicio>(`${this.apiUrl}/${id}`);
  }

  getOrdenByFolio(folio: number): Observable<OrdenServicio> {
    return this.http.get<OrdenServicio>(
      `${this.apiUrl}/folio/${folio}`
    );
  }

  saveOrden(orden: OrdenServicio): Observable<any> {
    return this.http.post(this.apiUrl, orden);
  }

  updateOrden(id: string, orden: OrdenServicio): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, orden);
  }

  deleteOrden(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}