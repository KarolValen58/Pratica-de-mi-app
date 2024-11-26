import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Salud {
  vacunado: boolean;
  esterilizado: boolean;
  condicionesMedicas?: string[];
}

export interface Propietario {
  nombre: string;
  telefono: string;
  email: string;
}

export interface Cachorro {
  _id?: string;
  nombre: string;
  raza: string;
  tamaño: string;
  descripcion: string;
  peso: number;
  edad: number;
  color: string;
  caracteristicasEspeciales?: string[];
  nivelEnergia?: number;
  imagen?: string;
  salud?: Salud;
  temperamento?: string[];
  entrenamientosCompletados?: string[];
  propietario?: Propietario;
}

export interface ApiResponse {
  exito: boolean;
  cantidad?: number;
  datos: Cachorro[] | Cachorro;
  mensaje?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CachorroService {
  private apiUrl = 'http://localhost:3000/api/cachorros';

  constructor(private http: HttpClient) {}

  // Obtener todos los cachorros
  getCachorros(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.apiUrl)
      .pipe(
        catchError(this.handleError<ApiResponse>('getCachorros'))
      );
  }

  // Obtener cachorro por ID
  getCachorro(id: string): Observable<ApiResponse> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<ApiResponse>(url)
      .pipe(
        catchError(this.handleError<ApiResponse>('getCachorro'))
      );
  }

  // Crear un nuevo cachorro
  createCachorro(cachorro: Cachorro): Observable<ApiResponse> {
    const { _id, ...cachorroData } = cachorro;
    
    // Asegurar arrays y objetos definidos
    const safeCachorro = {
      ...cachorroData,
      caracteristicasEspeciales: cachorro.caracteristicasEspeciales || [],
      temperamento: cachorro.temperamento || [],
      entrenamientosCompletados: cachorro.entrenamientosCompletados || [],
      imagen: cachorro.imagen || '',
      salud: cachorro.salud || { vacunado: false, esterilizado: false },
      propietario: cachorro.propietario || { nombre: '', telefono: '', email: '' }
    };

    return this.http.post<ApiResponse>(this.apiUrl, safeCachorro)
      .pipe(
        catchError(this.handleError<ApiResponse>('createCachorro'))
      );
  }

  // Actualizar un cachorro existente
  updateCachorro(id: string, cachorro: Cachorro): Observable<ApiResponse> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<ApiResponse>(url, cachorro)
      .pipe(
        catchError(this.handleError<ApiResponse>('updateCachorro'))
      );
  }

  // Eliminar un cachorro
  deleteCachorro(id: string): Observable<ApiResponse> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<ApiResponse>(url)
      .pipe(
        catchError(this.handleError<ApiResponse>('deleteCachorro'))
      );
  }

  // Buscar cachorros por raza
  searchCachorrosByRaza(raza: string): Observable<ApiResponse> {
    const url = `${this.apiUrl}/raza/${encodeURIComponent(raza)}`;
    return this.http.get<ApiResponse>(url)
      .pipe(
        catchError(this.handleError<ApiResponse>('searchCachorrosByRaza'))
      );
  }

  // Buscar cachorros por tamaño
  searchCachorrosByTamaño(tamaño: string): Observable<ApiResponse> {
    const url = `${this.apiUrl}/tamaño/${encodeURIComponent(tamaño)}`;
    return this.http.get<ApiResponse>(url)
      .pipe(
        catchError(this.handleError<ApiResponse>('searchCachorrosByTamaño'))
      );
  }

  // Manejo de errores
  private handleError<T>(operation = 'operation') {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of({ exito: false, datos: [] } as unknown as T);
    };
  }
}