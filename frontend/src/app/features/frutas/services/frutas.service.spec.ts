import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { FrutasService } from './frutas.service';

describe('FrutasService', () => {
  let service: FrutasService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FrutasService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(FrutasService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('obtiene todas las frutas', () => {
    const frutas = [{ id: 1, nombre: 'Mango', calificacion: 9 }];

    service.obtenerTodas().subscribe((resultado) => {
      expect(resultado).toEqual(frutas);
    });

    const request = httpTesting.expectOne('/api/frutas');
    expect(request.request.method).toBe('GET');
    request.flush(frutas);
  });

  it('obtiene una fruta por identificador', () => {
    const fruta = { id: 3, nombre: 'Fresa', calificacion: 8 };

    service.obtenerPorId(3).subscribe((resultado) => {
      expect(resultado).toEqual(fruta);
    });

    const request = httpTesting.expectOne('/api/frutas/3');
    expect(request.request.method).toBe('GET');
    request.flush(fruta);
  });

  it('crea una fruta mediante POST', () => {
    const entrada = { nombre: 'Lima', calificacion: 10 };

    service.crear(entrada).subscribe();

    const request = httpTesting.expectOne('/api/frutas');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(entrada);
    request.flush({ id: 4, ...entrada });
  });

  it('reemplaza una fruta mediante PUT', () => {
    const entrada = { nombre: 'Lima dulce', calificacion: 9 };

    service.reemplazar(4, entrada).subscribe();

    const request = httpTesting.expectOne('/api/frutas/4');
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(entrada);
    request.flush({ id: 4, ...entrada });
  });

  it('actualiza solo la calificacion mediante PATCH', () => {
    service.actualizarCalificacion(4, 7).subscribe();

    const request = httpTesting.expectOne('/api/frutas/4');
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({ calificacion: 7 });
    request.flush({ id: 4, nombre: 'Lima', calificacion: 7 });
  });

  it('elimina una fruta mediante DELETE', () => {
    service.eliminar(4).subscribe();

    const request = httpTesting.expectOne('/api/frutas/4');
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });
});
