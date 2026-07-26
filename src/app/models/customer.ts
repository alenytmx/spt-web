export class Direccion {

  calle?: string;
  entreCalles?: string;
  numInterior?: string;
  numExterior?: string;
  colonia?: string;
  referencias?: string;

  constructor(
    calle: string = '',
    entreCalles: string = '',
    numInterior: string = '',
    numExterior: string = '',
    colonia: string = '',
    referencias: string = ''
  ) {
    this.calle = calle;
    this.entreCalles = entreCalles;
    this.numInterior = numInterior;
    this.numExterior = numExterior;
    this.colonia = colonia;
    this.referencias = referencias;
  }
}

export class Customer {

  _id?: string;
  customerId?: string;

  nombres?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  nombreCompleto?: string;

  numTelefono?: string;
  email?: string;

  direccion?: Direccion;

  observaciones?: string;

  activo?: boolean;

  createdAt?: Date;
  updatedAt?: Date;

  constructor(
    nombres: string = '',
    apellidoPaterno: string = '',
    apellidoMaterno: string = '',
    numTelefono: string = '',
    direccion: Direccion = new Direccion(),
    email: string = '',
    observaciones: string = ''
  ) {
    this.nombres = nombres;
    this.apellidoPaterno = apellidoPaterno;
    this.apellidoMaterno = apellidoMaterno;
    this.numTelefono = numTelefono;
    this.direccion = direccion;
    this.email = email;
    this.observaciones = observaciones;
    this.activo = true;
  }
}