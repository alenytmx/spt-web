import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrdenServicioService } from '../../services/order.service';
import { PdfService } from '../../services/pdf/pdf.service';
import { Customer } from '../../models/customer';
import { ClientesService } from '../../services/clientes/clientes.service';

@Component({
  selector: 'app-order',
  standalone: false,
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent {
  ordenForm!: FormGroup;
  ordenes: any[] = [];
  editando = false;
  idEditando: string | null = null;
  mostrarFormulario = false;
  searchTerm: string = '';
  filterEstado: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 5;

  tiposOrden = ['Mantenimiento', 'Reparación'];
  estados = ['Pendiente', 'En proceso', 'Finalizado', 'Cancelado'];

  clienteForm!: FormGroup;

  clientes: Customer[] = [];
  clientesEncontrados: Customer[] = [];
  clienteSeleccionado: Customer | null = null;
  searchCliente = '';

  mostrarFormularioCliente = false;

  constructor(
    private fb: FormBuilder,
    private ordenService: OrdenServicioService,
    private pdfService: PdfService,
    private clientesService: ClientesService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getOrdenes();
    this.initClienteForm();
    this.getClientes();
  }

  initForm() {
    this.ordenForm = this.fb.group({
      fecha: [new Date().toISOString().substring(0, 10), Validators.required],
      usuario: ['', Validators.required],
      tipoOrden: ['', Validators.required],
      totalServicio: [0, [Validators.required, Validators.min(0)]],
      estado: ['Pendiente'],

      cliente: this.fb.group({
        nombres: ['', Validators.required],
        apellidoPaterno: [''],
        apellidoMaterno: [''],
        numTelefono: ['', Validators.required],
        direccion: this.fb.group({
          calle: ['', Validators.required],
          entreCalles: [''],
          numInterior: [''],
          numExterior: [''],
          colonia: ['', Validators.required],
          referencias: ['']
        })
      }),

      equipos: this.fb.array([])
    });

    this.agregarEquipo();
  }

  get equipos(): FormArray {
    return this.ordenForm.get('equipos') as FormArray;
  }

  nuevoEquipo(): FormGroup {
    return this.fb.group({
      tipoEquipo: [''],
      marca: [''],
      modelo: [''],
      numSerie: [''],
      observaciones: [''],
      accesoriosTexto: ['']
    });
  }

  agregarEquipo() {
    this.equipos.push(this.nuevoEquipo());
  }

  eliminarEquipo(index: number) {
    if (this.equipos.length > 1) {
      this.equipos.removeAt(index);
    }
  }

  prepararData() {
    const data = this.ordenForm.value;

    data.equipos = data.equipos.map((equipo: any) => ({
      tipoEquipo: equipo.tipoEquipo,
      marca: equipo.marca,
      modelo: equipo.modelo,
      numSerie: equipo.numSerie,
      observaciones: equipo.observaciones,
      accesorios: equipo.accesoriosTexto
        ? equipo.accesoriosTexto.split(',').map((a: string) => a.trim())
        : []
    }));

    return data;
  }

  guardarOrden() {
    if (this.ordenForm.invalid) {
      this.ordenForm.markAllAsTouched();
      return;
    }

    const data = this.prepararData();

    if (this.editando && this.idEditando) {
      this.ordenService.updateOrden(this.idEditando, data).subscribe({
        next: () => {
          this.getOrdenes();
          this.resetForm();
        },
        error: err => console.error(err)
      });
    } else {
      this.ordenService.saveOrden(data).subscribe({
        next: () => {
          this.getOrdenes();
          this.resetForm();
        },
        error: err => console.error(err)
      });
    }
  }

  getOrdenes() {
    this.ordenService.getOrdenes().subscribe({
      next: res => this.ordenes = res,
      error: err => console.error(err)
    });
  }

  editarOrden(orden: any) {
  this.mostrarFormulario = true;
  this.editando = true;
  this.idEditando = orden._id;

  this.equipos.clear();

  orden.equipos.forEach((equipo: any) => {
    this.equipos.push(this.fb.group({
      tipoEquipo: [equipo.tipoEquipo],
      marca: [equipo.marca],
      modelo: [equipo.modelo],
      numSerie: [equipo.numSerie],
      observaciones: [equipo.observaciones],
      accesoriosTexto: [equipo.accesorios?.join(', ')]
    }));
  });

  this.ordenForm.patchValue({
    fecha: orden.fecha?.substring(0, 10),
    usuario: orden.usuario,
    tipoOrden: orden.tipoOrden,
    totalServicio: orden.totalServicio,
    estado: orden.estado,
    cliente: orden.cliente
  });
  }

  eliminarOrden(id: string) {
    if (confirm('¿Seguro que deseas eliminar esta orden?')) {
      this.ordenService.deleteOrden(id).subscribe({
        next: () => this.getOrdenes(),
        error: err => console.error(err)
      });
    }
  }

  resetForm() {
    this.editando = false;
    this.idEditando = null;
    this.equipos.clear();
    this.initForm();
    this.mostrarFormulario = false;
  }

  verPdfOrden(id: string) {
      this.pdfService.generarPdfOrden(id).subscribe({
        next: (pdfBlob: Blob) => {
          const fileURL = URL.createObjectURL(pdfBlob);
          window.open(fileURL, '_blank');
        },
        error: err => {
          console.error('Error al generar PDF:', err);
        }
      });
  }
    get filteredOrdenes() {
    const term = this.searchTerm.toLowerCase().trim();

    return this.ordenes.filter((orden: any) => {
      const cliente = `${orden.cliente?.nombres || ''} ${orden.cliente?.apellidoPaterno || ''}`.toLowerCase();

      const matchesSearch =
        orden.numFolio?.toString().includes(term) ||
        cliente.includes(term) ||
        orden.cliente?.numTelefono?.toLowerCase().includes(term) ||
        orden.tipoOrden?.toLowerCase().includes(term) ||
        orden.estado?.toLowerCase().includes(term);

      const matchesEstado =
        !this.filterEstado || orden.estado === this.filterEstado;

      return matchesSearch && matchesEstado;
    });
  }

  get paginatedOrdenes() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredOrdenes.slice(start, start + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.filteredOrdenes.length / this.itemsPerPage);
  }

  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  initClienteForm() {
  this.clienteForm = this.fb.group({
    nombres: ['', Validators.required],
    apellidoPaterno: [''],
    apellidoMaterno: [''],
    numTelefono: ['', Validators.required],
    email: [''],
    observaciones: [''],
    direccion: this.fb.group({
      calle: ['', Validators.required],
      entreCalles: [''],
      numInterior: [''],
      numExterior: [''],
      colonia: ['', Validators.required],
      referencias: ['']
    })
  });
}

  getClientes() {
    this.clientesService.getCustomers().subscribe({
      next: res => {
        this.clientes = res;
      },
      error: err => console.error('Error al cargar clientes:', err)
    });
  }

  guardarCliente() {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }

    this.clientesService.saveCustomer(this.clienteForm.value).subscribe({
      next: () => {
        this.getClientes();
        this.resetClienteForm();
        this.mostrarFormularioCliente = false;
      },
      error: err => console.error('Error al guardar cliente:', err)
    });
  }

  resetClienteForm() {
    this.initClienteForm();
  }

  buscarCliente() {
    const term = this.searchCliente.trim();

    if (term.length < 2) {
      this.clientesEncontrados = [];
      return;
    }

    this.clientesService.searchCustomers(term).subscribe({
      next: res => {
        this.clientesEncontrados = res;
      },
      error: err => console.error('Error al buscar cliente:', err)
    });
  }

  seleccionarCliente(cliente: Customer) {
    this.clienteSeleccionado = cliente;

    this.ordenForm.patchValue({
      cliente: {
        nombres: cliente.nombres || '',
        apellidoPaterno: cliente.apellidoPaterno || '',
        apellidoMaterno: cliente.apellidoMaterno || '',
        numTelefono: cliente.numTelefono || '',
        direccion: {
          calle: cliente.direccion?.calle || '',
          entreCalles: cliente.direccion?.entreCalles || '',
          numInterior: cliente.direccion?.numInterior || '',
          numExterior: cliente.direccion?.numExterior || '',
          colonia: cliente.direccion?.colonia || '',
          referencias: cliente.direccion?.referencias || ''
        }
      }
    });

    this.searchCliente = `${cliente.customerId || ''} ${cliente.nombres || ''} ${cliente.apellidoPaterno || ''}`;
    this.clientesEncontrados = [];
  }
}
