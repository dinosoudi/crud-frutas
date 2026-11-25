import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FrutasService } from '../../services/frutas.service';
import { FormularioFruta } from './formulario-fruta';

describe('FormularioFruta', () => {
  let fixture: ComponentFixture<FormularioFruta>;
  let component: FormularioFruta;

  const frutasServiceMock = {
    obtenerPorId: vi.fn(),
    crear: vi.fn(),
    reemplazar: vi.fn(),
    actualizarCalificacion: vi.fn(),
  };

  async function configurar(id: string | null = null): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [FormularioFruta],
      providers: [
        provideRouter([
          { path: 'frutas', component: FormularioFruta },
        ]),
        { provide: FrutasService, useValue: frutasServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => id } },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioFruta);
    component = fixture.componentInstance;
  }

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('inicia en modo creación', async () => {
    await configurar();
    component.ngOnInit();

    expect(component.esEdicion()).toBe(false);
    expect(component.formulario.value.nombre).toBe('');
  });

  it('carga la fruta en modo edición', async () => {
    frutasServiceMock.obtenerPorId.mockReturnValue(of({
      id: 3,
      nombre: 'Mango',
      calificacion: 9,
    }));
    await configurar('3');

    component.ngOnInit();

    expect(component.esEdicion()).toBe(true);
    expect(component.formulario.value.nombre).toBe('Mango');
    expect(component.formulario.value.calificacion).toBe(9);
  });

  it('muestra error si no puede cargar una fruta', async () => {
    frutasServiceMock.obtenerPorId.mockReturnValue(
      throwError(() => new Error('No encontrada')),
    );
    await configurar('999');

    component.ngOnInit();

    expect(component.error()).toBe('No fue posible cargar la fruta.');
  });

  it('rechaza el formulario con datos inválidos', async () => {
    await configurar();
    component.ngOnInit();

    component.formulario.setValue({ nombre: '', calificacion: 11 });
    component.guardar();

    expect(component.formulario.invalid).toBe(true);
  });

  it('crea una fruta mediante POST', async () => {
    frutasServiceMock.crear.mockReturnValue(of({ id: 4, nombre: 'Fresa', calificacion: 8 }));
    await configurar();
    component.ngOnInit();

    component.formulario.setValue({ nombre: 'Fresa', calificacion: 8 });
    component.guardar();

    expect(frutasServiceMock.crear).toHaveBeenCalledWith({ nombre: 'Fresa', calificacion: 8 });
  });

  it('usa PATCH cuando solo cambia la calificación', async () => {
    frutasServiceMock.obtenerPorId.mockReturnValue(of({ id: 3, nombre: 'Mango', calificacion: 9 }));
    frutasServiceMock.actualizarCalificacion.mockReturnValue(of({ id: 3, nombre: 'Mango', calificacion: 7 }));
    await configurar('3');
    component.ngOnInit();

    component.formulario.setValue({ nombre: 'Mango', calificacion: 7 });
    component.guardar();

    expect(frutasServiceMock.actualizarCalificacion).toHaveBeenCalledWith(3, 7);
  });

  it('usa PUT cuando cambia el nombre', async () => {
    frutasServiceMock.obtenerPorId.mockReturnValue(of({ id: 3, nombre: 'Mango', calificacion: 9 }));
    frutasServiceMock.reemplazar.mockReturnValue(of({ id: 3, nombre: 'Mango verde', calificacion: 9 }));
    await configurar('3');
    component.ngOnInit();

    component.formulario.setValue({ nombre: 'Mango verde', calificacion: 9 });
    component.guardar();

    expect(frutasServiceMock.reemplazar).toHaveBeenCalledWith(3, {
      nombre: 'Mango verde',
      calificacion: 9,
    });
  });

  it('devuelve la escala correcta de colores', async () => {
    await configurar();

    expect(component.colorCalificacion(1)).toBe('#dc2626');
    expect(component.colorCalificacion(5)).toBe('#eabf32');
    expect(component.colorCalificacion(10)).toBe('#267044');
  });
});
