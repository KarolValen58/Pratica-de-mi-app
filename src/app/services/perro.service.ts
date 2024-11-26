import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Perro {
  _id?: string;
  nombre: string;
  raza: string;
  dimensionCorporal?: string;
  tamaño: string;
  descripcion: string;
  peso: number;
  edad: number;
  color: string;
  nivelEnergia: number;  // Changed to required field
  caracteristicasEspeciales?: string[];
  imagen?: string;
  salud?: {
    vacunado: boolean;
    esterilizado: boolean;
    condicionesMedicas?: string[];
  };
  temperamento?: string[];
  entrenamientosCompletados?: string[];
  propietario?: {
    nombre: string;
    telefono: string;
    email: string;
  };
}

export interface ApiResponse {
  exito: boolean;
  cantidad?: number;
  datos: Perro[] | Perro;
  mensaje?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PerroService {
  private apiUrl = 'http://localhost:3000/api/cachorros';

  constructor(private http: HttpClient) {}

  getPerros(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.apiUrl).pipe(
      catchError(this.handleError<ApiResponse>('getPerros'))
    );
  }

  createPerro(perroOriginal: Perro): Observable<ApiResponse> {
    const {
      nombre,
      raza,
      tamaño,
      descripcion,
      peso,
      edad,
      color,
      nivelEnergia,  // Added nivelEnergia
      caracteristicasEspeciales,
      imagen,
      temperamento
    } = perroOriginal;

    const perroToSend = {
      nombre,
      raza,
      tamaño,
      descripcion,
      peso,
      edad,
      color,
      nivelEnergia,  // Added nivelEnergia
      caracteristicasEspeciales: caracteristicasEspeciales || [],
      imagen: imagen || '',
      temperamento: temperamento || [],
      salud: {
        vacunado: false,
        esterilizado: false,
        condicionesMedicas: []
      }
    };

    console.log('Datos a enviar:', JSON.stringify(perroToSend, null, 2));

    return this.http.post<ApiResponse>(this.apiUrl, perroToSend)
      .pipe(
        catchError(this.handleError<ApiResponse>('createPerro'))
      );
  }

  updatePerro(id: string, perroOriginal: Perro): Observable<ApiResponse> {
    const {
      nombre,
      raza,
      tamaño,
      descripcion,
      peso,
      edad,
      color,
      nivelEnergia,  // Added nivelEnergia
      caracteristicasEspeciales,
      imagen,
      temperamento
    } = perroOriginal;

    const perroToSend = {
      nombre,
      raza,
      tamaño,
      descripcion,
      peso,
      edad,
      color,
      nivelEnergia,  // Added nivelEnergia
      caracteristicasEspeciales: caracteristicasEspeciales || [],
      imagen: imagen || '',
      temperamento: temperamento || [],
      salud: {
        vacunado: false,
        esterilizado: false,
        condicionesMedicas: []
      }
    };

    return this.http.put<ApiResponse>(`${this.apiUrl}/${id}`, perroToSend)
      .pipe(
        catchError(this.handleError<ApiResponse>('updatePerro'))
      );
  }

  deletePerro(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError<ApiResponse>('deletePerro'))
      );
  }

  private handleError<T>(operation = 'operation') {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of({ exito: false, datos: [], mensaje: error.message } as unknown as T);
    };
  }
}