import { Component, OnInit } from "@angular/core";
import { MessageService } from "app/services/MessageService";

@Component({
  selector: "planes-nacionales",
  templateUrl: "planes-nacionales.html"
})
export class PlanesNacionalesComponent implements OnInit {

  public planes: any[] = [
    {
      nro: 1,
      nombre: "Plan Nacional de Desarrollo 2014-2030",
      institucion: "STP",
      url: "http://www.stp.gov.py/v1/?wpfb_dl=14",
      externo: false
    },
    {
      nro: 2,
      nombre: "Plan Director TIC",
      institucion: "MITIC",
      url: "http://www.senatics.gov.py/pdt",
      externo: false
    },
    {
      nro: 3,
      nombre: "	Plan Nacional de Banda Ancha 2011-2015",
      institucion: "CONATEL",
      url: "http://www.conatel.gov.py/files/MANUAL%20PLAN%20NACIONAL.pdf",
      externo: false
    },
    {
      nro: 4,
      nombre: "Plan Nacional de Telecomunicaciones",
      institucion: "CONATEL",
      url:
        "http://www.conatel.gov.py/index.php?option=com_content&view=article&id=30&Itemid=115",
      externo: false
    },
    {
      nro: 5,
      nombre: "Plan Nacional de Numeración",
      institucion: "CONATEL",
      url:
        "http://www.conatel.gov.py/index.php?option=com_content&view=article&id=189:plan-nacional-de-atribucion-de-frecuencias&catid=23&Itemid=164",
      externo: false
    },
    {
      nro: 6,
      nombre: "Plan Nacional de Cultura	",
      institucion: "SNC",
      url:
        "http://issuu.com/secretarianacionalcultura/docs/plan_nacional_de_cultura",
      externo: false
    },
    {
      nro: 7,
      nombre: "Plan de Gobierno Abierto",
      institucion: "STP y MITIC",
      url: "http://www.gobiernoabierto.gov.py/conoce",
      externo: false
    },
    {
      nro: 8,
      nombre: "Política Nacional de la Niñez y la Adolescencia - POLNA",
      institucion: "SNNA",
      url: "http://www.snna.gov.py/pagina/5-planes-nacionales.html",
      externo: false
    },
    {
      nro: 9,
      nombre:
        "Plan Nacional de Prevención y Erradicación del Trabajo Infantil y Protección del Trabajo de los Adolescentes",
      institucion: "SNNA",
      url: "http://www.snna.gov.py/pagina/5-planes-nacionales.html",
      externo: false
    },
    {
      nro: 10,
      nombre:
        "Plan Nacional de Prevención y Erradicación de la Explotación Sexual de Niñas, Niños y Adolescentes en Paraguay",
      institucion: "SNNA",
      url: "http://www.snna.gov.py/pagina/5-planes-nacionales.html",
      externo: false
    },
    {
      nro: 11,
      nombre:
        "Plan Nacional de Promoción de la Calidad de Vida y Salud con Equidad de la Adolescencia 2010-2015",
      institucion: "SNNA",
      url: "http://www.snna.gov.py/pagina/5-planes-nacionales.html",
      externo: false
    },
    {
      nro: 12,
      nombre:
        "Plan Nacional de Desarrollo Integral de la Primera Infancia 2011-2020",
      institucion: "SNNA",
      url: "http://www.snna.gov.py/pagina/5-planes-nacionales.html",
      externo: false
    },
    {
      nro: 13,
      nombre:
        "Plan Nacional de Promoción de la Calidad de Vida y Salud con Equidad de la Niñez 2010-2015",
      institucion: "SNNA",
      url: "http://www.snna.gov.py/pagina/5-planes-nacionales.html",
      externo: false
    },
    {
      nro: 14,
      nombre: "Plan Nacional de Educación 2024",
      institucion: "MEC",
      url:
        "http://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&ved=0CB4QFjAA&url=http%3A%2F%2Fwww.mec.gov.py%2Fcms_v2%2Fadjuntos%2F10516&ei=8zB3Vb60DMSbgwSp2oD4Bg&usg=AFQjCNFdGXuS-A--tuINMhSCOZ8epiGV2w&sig2=Q1dHSIHeOv2Bbj8SBhoK_g&bvm=bv.95039771,d.eXY&cad=rja",
      externo: false
    },
    {
      nro: 15,
      nombre: "Plan Nacional de Educación en Derechos Humanos",
      institucion: "MEC",
      url:
        "http://www.mec.gov.py/cms_v2/recursos/9736-plan-nacional-de-educacion-en-derechos-humanos",
      externo: false
    },
    {
      nro: 16,
      nombre:
        "Plan Nacional de Promoción de la Calidad de Vida y Salud con Equidad de la Niñez 2010-2015",
      institucion: "MSPyBS",
      url:
        "http://www.mspbs.gov.py/planificacion/wp-content/uploads/2012/06/plan_ninez_20101.pdf",
      externo: false
    },
    {
      nro: 17,
      nombre: "Plan Nacional de Salud Sexual y Reproductiva 2014-2018",
      institucion: "MSPyBS",
      url: "http://www.cepep.org.py/archivos/PNSSR2014.pdf",
      externo: false
    },
    {
      nro: 18,
      nombre: "Plan Nacional de Seguridad Vial 2013-2018",
      institucion: "MOPC",
      url: "http://www.iadb.org/Document.cfm?id=39031041",
      externo: false
    },
    {
      nro: 19,
      nombre: "Plan Nacional de Saneamiento",
      institucion: "MOPC",
      url: "http://www.mopc.gov.py/plan-nacional-de-saneamiento-u69",
      externo: false
    },
    {
      nro: 20,
      nombre: "Plan de Lucha contra el Microtráfico",
      institucion: "Ministerio Público",
      url:
        "http://www.ministeriopublico.gov.py/documentos/transparencia/docum/plan_microtrafico.pdf",
      externo: false
    },
    {
      nro: 21,
      nombre: "Plan Umbral Paraguay",
      institucion: "Ministerio Público",
      url:
        "http://www.ministeriopublico.gov.py/documentos/transparencia/docum/umbral.pdf",
      externo: false
    },
    {
      nro: 22,
      nombre:
        "Estrategia Nacional de Prevención y Erradicación del Trabajo Infantil y Protección del Trabajo Adolescente en el Paraguay. 2010-2015",
      institucion: "MTESS",
      url:
        "http://www.mtess.gov.py/application/files/8214/2974/4652/resolucion03-10.pdf",
      externo: false
    },
    {
      nro: 23,
      nombre: "Plan Nacional de Juventud 2013-2020",
      institucion: "MEC y Vice Ministerio de la Juventud",
      url: "http://www.mec.gov.py/cms_v2/adjuntos/7259",
      externo: false
    },
    {
      nro: 24,
      nombre:
        "Plan Maestro de Desarrollo Sostenible del Sector Turístico del Paraguay - 2012",
      institucion: "SENATUR",
      url:
        "http://www.senatur.gov.py/pdf/Plan%20Maestro%20de%20Turismo%20-%20Paraguay%202012.pdf",
      externo: false
    },
    {
      nro: 25,
      nombre: "Política Nacional Migratoria del Paraguay",
      institucion: "Dirección General de Migraciones",
      url:
        "http://www.presidencia.gov.py/archivos/documentos/DECRETO4483_59t0gut8.pdf",
      externo: false
    },
    {
      nro: 26,
      nombre: "Lineamientos del Portal Paraguay y Trámites en Línea",
      institucion: "MITIC",
      url: "/lineamientos",
      externo: true
    }
  ];

  constructor(
    public messageService: MessageService
  ) {}

  ngOnInit(): void {
    window.scrollTo(200, 1);
  }
}
