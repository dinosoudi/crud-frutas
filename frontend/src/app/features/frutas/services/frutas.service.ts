import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Fruta, FrutaCrear } from '../models/fruta.model';

@Injectable({ providedIn: 'root' })
export class FrutasService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/frutas';

  obtenerTodas(): Observable<Fruta[]> {
    return this.http.get<Fruta[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Fruta> {
    return this.http.get<Fruta>(`${this.apiUrl}/${id}`);
  }

  crear(fruta: FrutaCrear): Observable<Fruta> {
    return this.http.post<Fruta>(this.apiUrl, fruta);
  }

  reemplazar(id: number, fruta: FrutaCrear): Observable<Fruta> {
    return this.http.put<Fruta>(`${this.apiUrl}/${id}`, fruta);
  }

  actualizarCalificacion(id: number, calificacion: number): Observable<Fruta> {
    return this.http.patch<Fruta>(`${this.apiUrl}/${id}`, { calificacion });
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
