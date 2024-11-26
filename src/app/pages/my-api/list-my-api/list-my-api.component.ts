import { Component, OnInit } from '@angular/core';
import { PerroService, Perro } from '../../../services/perro.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-my-api',
  templateUrl: './list-my-api.component.html',
  styleUrls: ['./list-my-api.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]})
  
export class ListMyApiComponent implements OnInit {
  perros: Perro[] = [];
  filteredPerros: Perro[] = [];
  isLoading = false;
  noResults = false;
  searchTerm = '';
  selectedPerro: Perro | null = null;

  // Paginación
  currentPage = 1;
  itemsPerPage = 6;
  totalItems = 0;

  constructor(private perroService: PerroService) {}

  ngOnInit(): void {
    this.loadPerros();
  }

  get paginatedPerros(): Perro[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredPerros.slice(startIndex, startIndex + this.itemsPerPage);
  }

  loadPerros(): void {
    this.isLoading = true;
    this.perroService.getPerros().subscribe((response) => {
      if (response.exito) {
        this.perros = Array.isArray(response.datos) ? 
        response.datos.map(perro => ({
          ...perro,
          dimensionCorporal: perro.tamaño // Sincronizamos dimensionCorporal con tamaño
        })) : 
        [response.datos].map(perro => ({
          ...perro,
          dimensionCorporal: perro.tamaño
        }));
      this.filteredPerros = [...this.perros];
      } else {
        this.noResults = true;
      }
      this.isLoading = false;
    });
  }

  onSearch(): void {
    this.filteredPerros = this.perros.filter(perro =>
      perro.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.noResults = this.filteredPerros.length === 0;
    this.currentPage = 1; // Reiniciar a la primera página
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredPerros = [...this.perros];
    this.noResults = false;
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  onPerroSelect(perro: Perro): void {
    this.selectedPerro = perro;
  }

  getPageNumbers(): number[] {
    const totalPages = Math.ceil(this.filteredPerros.length / this.itemsPerPage);
    return Array.from({ length: totalPages }, (_, i) => i + 1); // Array del 1 al totalPages
  }
}
