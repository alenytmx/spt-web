export class Direccion {
  constructor(
    public calle: string,
    public entreCalles: string,
    public numInterior: string,
    public numExterior: string,
    public colonia: string,
    public referencias: string
  ) {}
}

export class Cliente {
  constructor(
    public nombres: string,
    public apellidoPaterno: string,
    public apellidoMaterno: string,
    public numTelefono: string,
    public direccion: Direccion
  ) {}
}

export class Equipo {
  constructor(
    public tipoEquipo: string,
    public marca: string,
    public modelo: string,
    public numSerie: string,
    public observaciones: string,
    public accesorios: string[]
  ) {}
}

export class OrdenServicio {
  _id?: string;

  constructor(
    public fecha: string,
    public usuario: string,
    public tipoOrden: string,
    public cliente: Cliente,
    public equipos: Equipo[],
    public totalServicio: number,
    public estado: string,
    public createdAt?: string,
    public updatedAt?: string
  ) {}
}