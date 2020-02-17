export class AppConfig {

  public readonly URL_BASE_PORTAL = 'https://www.paraguay.gov.py';
  public readonly URL_AIP_FRONT = 'https://informacionpublica.paraguay.gov.py/portal/#!/ciudadano/solicitud/';
  public readonly URL_AIP_BACK = 'https://informacionpublica.paraguay.gov.py/portal-core/rest/solicitudes?limit=30&offset=0&search=';
  public readonly URL_DATOS_ABIERTOS = 'https://www.datos.gov.py/api/3/action/package_search?q=';
  public readonly URL_CONSULTAS = 'https://consultas.paraguay.gov.py/consultas/open.php';
  public readonly URL_TRADUCTOR = 'https://www.senatics.gov.py/traductor/traducir.php';
  public readonly URL_CONSULTA_PUBLICA = 'https://docs.google.com/forms/d/e/1FAIpQLSdh7rJONoWQWS47IzxRp8o-B_gNBRuS7C1KYJtZrp85AkQ9rA/viewform?embedded=true';
  public readonly URL_CONSULTA_PUBLICA_RESULTADO = 'https://app.powerbi.com/view?r=eyJrIjoiODkyM2I5ZDYtOTJhYi00NWFiLTg3NzUtZGYyZTU1YWE3MzQ1IiwidCI6Ijg3ZGYyNzk3LWZkNjMtNDhlNS1hMjMxLWI0MjVmZDVkZDM0YiIsImMiOjR9'; 
  public readonly URL_RSS_IPPARAGUAY = 'https://www.ip.gov.py/ip/feed/';
  public readonly URL_SUSCRIPCION = 'https://eventos.paraguay.gov.py/registro/registro.php?evento=128';
  public readonly URL_AGENDA_TURNO = 'https://agendarturno.mitic.gov.py/';

  //PRODUCCION
  public readonly API = "api";
  public readonly API_COMPRAS_PUBLICAS = 'plugins';
  public readonly API_BOLSA_TRABAJO = 'plugins';
  public readonly API_GESTION_CLAVE = 'auth';
  public readonly API_DOCUMENTOS = 'docsapi';
  
  /*/
  //DESARROLLO
  public readonly API = 'http://localhost:8080/portalpy-backend-core/rest';
  public readonly API_COMPRAS_PUBLICAS = 'http://localhost:8080/portal-py-plugins/rest';
  public readonly API_BOLSA_TRABAJO = 'http://localhost:8080/portal-py-plugins/rest';
  public readonly API_GESTION_CLAVE = 'http://localhost:8080/auth/rest';
  public readonly API_GESTION_CLAVE = 'https://devportalpy.mitic.gov.py/auth';
  public readonly API_DOCUMENTOS = 'http://localhost:8080/documentos-core/rest';
  /*/

  //  public readonly API = 'https://devportalpy.mitic.gov.py/api';
  //  public readonly API_COMPRAS_PUBLICAS = 'plugins';
  //  public readonly API_BOLSA_TRABAJO = 'plugins';
  //  public readonly API_GESTION_CLAVE = 'https://devportalpy.mitic.gov.py/auth';
  //  public readonly API_DOCUMENTOS = 'https://devportalpy.mitic.gov.py/docsapi';
  
}
