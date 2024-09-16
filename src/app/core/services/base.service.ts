import { inject, Injectable } from '@angular/core';
import { Environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { core } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  apiUrl = Environment.apiUrl;
  httpClient = inject(HttpClient);

  get<T>(path: string): Observable<T> {
    return this.httpClient.get<T>(`${this.apiUrl}/${path}`);
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.httpClient.post<T>(`${this.apiUrl}/${path}`, body, {headers: { 'Content-Type': 'application/json' }});
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.httpClient.put<T>(`${this.apiUrl}/${path}`, body);
  }

  delete<T>(path: string) {
    return this.httpClient.delete<T>(`${this.apiUrl}/${path}`);
  }
}
