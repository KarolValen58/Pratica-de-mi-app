import { Component, OnInit } from '@angular/core';
import { PerroService, Perro, ApiResponse } from '../../../services/perro.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-my-api',
  templateUrl: './create-my-api.component.html',
  styleUrls: ['./create-my-api.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CreateMyApiComponent implements OnInit {
  perro: Perro = {
    nombre: '',
    raza: '',
    dimensionCorporal: 'Pequeño',
    tamaño: 'Pequeño',
    descripcion: '',
    peso: 0,
    edad: 0,
    color: '',
    nivelEnergia: 1,  // Added default value
    imagen: '',
    caracteristicasEspeciales: [],
    temperamento: []
  };
  
  newCaracteristica: string = '';
  perros: Perro[] = [];
  filteredPerros: Perro[] = [];
  searchTerm: string = '';
  message: string = '';
  success: boolean = false;
  isEditing: boolean = false;
  showModal: boolean = false;
  modalTitle: string = '';

  constructor(private perroService: PerroService) {}

  ngOnInit() {
    this.loadPerros();
  }

  searchPerros() {
    if (!this.searchTerm) {
      this.filteredPerros = this.perros;
    } else {
      this.filteredPerros = this.perros.filter(perro => 
        perro.raza.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  addCaracteristica() {
    if (this.newCaracteristica.trim()) {
      if (!this.perro.caracteristicasEspeciales) {
        this.perro.caracteristicasEspeciales = [];
      }
      if (!this.perro.caracteristicasEspeciales.includes(this.newCaracteristica.trim())) {
        this.perro.caracteristicasEspeciales.push(this.newCaracteristica.trim());
        this.newCaracteristica = '';
      }
    }
  }

  removeCaracteristica(caracteristica: string) {
    if (this.perro.caracteristicasEspeciales) {
      this.perro.caracteristicasEspeciales = this.perro.caracteristicasEspeciales.filter(c => c !== caracteristica);
    }
  }

  loadPerros() {
    this.perroService.getPerros().subscribe(
      (response: ApiResponse) => {
        if (response.exito) {
          // Asegurarse de que dimensionCorporal se sincronice con tamaño al cargar los datos
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
          this.message = 'Error al cargar los perros';
        }
      },
      error => {
        this.message = 'Error al cargar cachorros: ' + error.message;
      }
    );
  }

  onSubmit() {
    const perroToSubmit: Perro = {
      nombre: this.perro.nombre,
      raza: this.perro.raza,
      tamaño: this.perro.dimensionCorporal || 'Pequeño',
      descripcion: this.perro.descripcion,
      peso: this.perro.peso,
      edad: this.perro.edad,
      color: this.perro.color,
      nivelEnergia: this.perro.nivelEnergia,  // Added nivelEnergia
      caracteristicasEspeciales: this.perro.caracteristicasEspeciales || [],
      imagen: this.perro.imagen || '',
      temperamento: this.perro.temperamento || []
    };

    if (this.isEditing && this.perro._id) {
      this.perroService.updatePerro(this.perro._id, perroToSubmit).subscribe(
        (response: ApiResponse) => {
          this.handleResponse(response, 'actualizado');
        }
      );
    } else {
      this.perroService.createPerro(perroToSubmit).subscribe(
        (response: ApiResponse) => {
          this.handleResponse(response, 'creado');
        }
      );
    }
  }

  private handleResponse(response: ApiResponse, action: string) {
    this.success = response.exito;
    this.message = response.exito 
      ? `Cachorro ${action} exitosamente!` 
      : `Error al ${action} cachorro.`;
    
    if (response.exito) {
      this.closeModal();
      this.loadPerros();
    }
  }

  openModal(editing: boolean = false, perro?: Perro) {
    this.isEditing = editing;
    this.modalTitle = editing ? 'Editar Cachorro' : 'Crear Nuevo Cachorro';
    
    if (editing && perro) {
      this.perro = { ...perro };
    } else {
      this.resetForm();
    }
    
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
  }

  deletePerro(id: string) {
    this.perroService.deletePerro(id).subscribe(
      (response: ApiResponse) => {
        this.success = response.exito;
        this.message = response.exito 
          ? 'Cachorro eliminado exitosamente!' 
          : 'Error al eliminar cachorro.';
        
        if (response.exito) {
          this.loadPerros();
        }
      }
    );
  }

  resetForm() {
    this.perro = {
      nombre: '',
      raza: '',
      dimensionCorporal: 'Pequeño',
      tamaño: 'Pequeño',
      descripcion: '',
      peso: 0,
      edad: 0,
      color: '',
      nivelEnergia: 1,  // Added default value
      imagen: '',
      caracteristicasEspeciales: [],
      temperamento: []
    };
  }
}