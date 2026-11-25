import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FrutasService } from '../../services/frutas.service';

@Component({
  selector: 'app-formulario-fruta',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './formulario-fruta.html',
  styleUrl: './formulario-fruta.css',
})
export class FormularioFruta implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly frutasService = inject(FrutasService);
  private readonly formBuilder = inject(FormBuilder);

  readonly esEdicion = signal(false);
  readonly cargando = signal(false);
  readonly error = signal('');
  readonly calificaciones = Array.from({ length: 10 }, (_, indice) => indice + 1);

  private frutaId: number | null = null;
  private nombreOriginal = '';
  private calificacionOriginal = 5;

  readonly formulario = this.formBuilder.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    calificacion: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.esEdicion.set(true);
      this.frutaId = Number(id);
      this.cargarFruta(this.frutaId);
    }
  }

  cargarFruta(id: number): void {
    this.cargando.set(true);

    this.frutasService.obtenerPorId(id).subscribe({
      next: (fruta) => {
        this.nombreOriginal = fruta.nombre;
        this.calificacionOriginal = fruta.calificacion;
        this.formulario.setValue({
          nombre: fruta.nombre,
          calificacion: fruta.calificacion,
        });
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No fue posible cargar la fruta.');
        this.cargando.set(false);
      },
    });
  }

  guardar(): void {
    this.error.set('');

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const valores = this.formulario.getRawValue();

    if (this.esEdicion() && this.frutaId !== null) {
      this.guardarEdicion(valores);
      return;
    }

    this.cargando.set(true);
    this.frutasService.crear(valores).subscribe({
      next: () => void this.router.navigate(['/frutas']),
      error: () => {
        this.error.set('No fue posible agregar la fruta.');
        this.cargando.set(false);
      },
    });
  }

  private guardarEdicion(valores: { nombre: string; calificacion: number }): void {
    if (!this.frutaId) {
      return;
    }

    const nombreCambio = valores.nombre !== this.nombreOriginal;
    const calificacionCambio = valores.calificacion !== this.calificacionOriginal;

    if (!nombreCambio && !calificacionCambio) {
      void this.router.navigate(['/frutas']);
      return;
    }

    this.cargando.set(true);

    if (nombreCambio) {
      this.frutasService.reemplazar(this.frutaId, valores).subscribe({
        next: () => void this.router.navigate(['/frutas']),
        error: () => {
          this.error.set('No fue posible actualizar la fruta.');
          this.cargando.set(false);
        },
      });
      return;
    }

    this.frutasService.actualizarCalificacion(this.frutaId, valores.calificacion).subscribe({
      next: () => void this.router.navigate(['/frutas']),
      error: () => {
        this.error.set('No fue posible actualizar la calificación.');
        this.cargando.set(false);
      },
    });
  }

  colorCalificacion(calificacion: number): string {
    const colores = [
      '#dc2626', '#e34b32', '#ed7a32', '#f2a43a', '#eabf32',
      '#b9c84b', '#82bd58', '#55a85d', '#3d8f50', '#267044',
    ];

    return colores[Math.min(10, Math.max(1, calificacion)) - 1];
  }
}
