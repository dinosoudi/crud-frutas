import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FrutasService } from '../../services/frutas.service';
import { ListaFrutas } from './lista-frutas';

describe('ListaFrutas', () => {
  let fixture: ComponentFixture<ListaFrutas>;
  let component: ListaFrutas;

  const frutasServiceMock = {
    obtenerTodas: vi.fn(),
    eliminar: vi.fn(),
  };

  beforeEach(async () => {
    frutasServiceMock.obtenerTodas.mockReturnValue(of([
      { id: 1, nombre: 'Mango', calificacion: 9 },
      { id: 2, nombre: 'Toronja', calificacion: 1 },
    ]));

    await TestBed.configureTestingModule({
      imports: [ListaFrutas],
      providers: [
        provideRouter([]),
        { provide: FrutasService, useValue: frutasServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaFrutas);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('carga y selecciona la primera fruta', () => {
    component.ngOnInit();

    expect(component.frutas().length).toBe(2);
    expect(component.frutaSeleccionada()?.nombre).toBe('Mango');
    expect(component.cargando()).toBe(false);
  });

  it('permite cambiar la fruta seleccionada', () => {
    component.ngOnInit();

    component.seleccionar({ id: 2, nombre: 'Toronja', calificacion: 1 });

    expect(component.frutaSeleccionada()?.nombre).toBe('Toronja');
  });

  it('devuelve rojo para 1 y verde sobrio para 10', () => {
    expect(component.colorCalificacion(1)).toBe('#dc2626');
    expect(component.colorCalificacion(5)).toBe('#eabf32');
    expect(component.colorCalificacion(10)).toBe('#267044');
  });

  it('devuelve el identificador para editar', () => {
    component.ngOnInit();

    expect(component.rutaEditar()).toBe(1);
  });

  it('muestra el error si no puede cargar frutas', () => {
    frutasServiceMock.obtenerTodas.mockReturnValue(
      throwError(() => new Error('API no disponible')),
    );

    component.cargarFrutas();

    expect(component.error()).toBe('No fue posible cargar las frutas.');
    expect(component.cargando()).toBe(false);
  });

  it('confirma antes de eliminar y recarga la lista', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    frutasServiceMock.eliminar.mockReturnValue(of(undefined));
    component.ngOnInit();

    component.eliminarSeleccionada();

    expect(frutasServiceMock.eliminar).toHaveBeenCalledWith(1);
    expect(component.eliminando()).toBe(false);
  });

  it('no elimina si el usuario cancela', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    component.ngOnInit();

    component.eliminarSeleccionada();

    expect(frutasServiceMock.eliminar).not.toHaveBeenCalled();
  });
});
