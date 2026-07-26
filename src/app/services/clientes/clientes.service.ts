import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer } from '../../models/customer';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
   private apiUrl = 'http://localhost:3000/api/cliente';

  constructor(
    private http: HttpClient
  ) { }

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl);
  }

  getCustomer(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  getCustomerByCustomerId(customerId: string): Observable<Customer> {
    return this.http.get<Customer>(
      `${this.apiUrl}/customer-id/${customerId}`
    );
  }

  searchCustomers(term: string): Observable<Customer[]> {
    return this.http.get<Customer[]>(
      `${this.apiUrl}/search?term=${term}`
    );
  }

  saveCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(
      this.apiUrl,
      customer
    );
  }

  updateCustomer(
    id: string,
    customer: Customer
  ): Observable<Customer> {
    return this.http.put<Customer>(
      `${this.apiUrl}/${id}`,
      customer
    );
  }

  disableCustomer(id: string): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/disable/${id}`,
      {}
    );
  }

  deleteCustomer(id: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }
}
