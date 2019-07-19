export class IdentidadPersona{
   	iss: string;
	exp: string;
	sub: string;
	aud: string;
	tokenExp: number;
	
	cedula: string;
	nombres: string;
	apellidos: string;
	fechaNacimiento: string;
	nacionalidad: string;
	sexo: string;
	idDepartamento: number = 0;
	departamento: string;
	idCiudad: number = 0;
	ciudad: string;
	barrio: string;
	idBarrio: number;
	idDistrito: number = 0;
	telefonoParticular: string;
	telefonoMovil: string;
	domicilio: string;

	constructor() {    
		this.idDepartamento = 0;
		this.idCiudad = 0; 
		this.idBarrio = 0;
    }
}
