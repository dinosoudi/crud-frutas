import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Fruta } from '../../models/fruta.model';
import { FrutasService } from '../../services/frutas.service';

@Component({
  selector: 'app-lista-frutas',
  imports: [CommonModule, RouterLink],
  templateUrl: './lista-frutas.html',
  styleUrl: './lista-frutas.css',
})
export class ListaFrutas implements OnInit {
  private readonly frutasService = inject(FrutasService);

  readonly frutas = signal<Fruta[]>([]);
  readonly frutaSeleccionada = signal<Fruta | null>(null);
  readonly cargando = signal(true);
  readonly eliminando = signal(false);
  readonly error = signal('');

  ngOnInit(): void {
    this.cargarFrutas();
  }

  cargarFrutas(): void {
    this.cargando.set(true);
    this.error.set('');

    this.frutasService.obtenerTodas().subscribe({
      next: (frutas) => {
        this.frutas.set(frutas);
        this.frutaSeleccionada.set(frutas[0] ?? null);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No fue posible cargar las frutas.');
        this.cargando.set(false);
      },
    });
  }

  seleccionar(fruta: Fruta): void {
    this.frutaSeleccionada.set(fruta);
  }

  colorCalificacion(calificacion: number): string {
    const colores = [
      '#dc2626', '#e34b32', '#ed7a32', '#f2a43a', '#eabf32',
      '#b9c84b', '#82bd58', '#55a85d', '#3d8f50', '#267044',
    ];

    return colores[Math.min(10, Math.max(1, calificacion)) - 1];
  }

  rutaEditar(): number | null {
    return this.frutaSeleccionada()?.id ?? null;
  }

  eliminarSeleccionada(): void {
    const fruta = this.frutaSeleccionada();

    if (!fruta) {
      return;
    }

    const confirmado = window.confirm(
      `¿Eliminar "${fruta.nombre}" con calificación ${fruta.calificacion}?`,
    );

    if (!confirmado) {
      return;
    }

    this.eliminando.set(true);
    this.error.set('');

    this.frutasService.eliminar(fruta.id).subscribe({
      next: () => {
        this.eliminando.set(false);
        this.cargarFrutas();
      },
      error: () => {
        this.eliminando.set(false);
        this.error.set('No fue posible eliminar la fruta.');
      },
    });
  }
}
