import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MessageService } from 'app/services/MessageService';
import { IdentidadElectronicaService } from 'app/services/identidad-electronica.service';
import { Persona } from 'app/plugins/gestion-clave/persona';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { IdentidadRespuesta } from '../model/Identidad-respuesta.model';
import { RecaptchaComponent } from 'ng-recaptcha';

@Component({
  selector: 'app-restablecer-clave',
  templateUrl: './restablecer-clave.component.html',
  styleUrls: ['./restablecer-clave.component.css']
})
export class RestablecerClaveComponent implements OnInit, AfterViewInit {

  public persona: Persona;
  public captcha: any;
  public captchaResponse: string;
  public loading: boolean;
  public mensaje: string;

  @ViewChild('captchaControl') reCaptcha: RecaptchaComponent;

  constructor(public messageService: MessageService, private identidadService: IdentidadElectronicaService, private modalService: NgbModal, private router: Router) { }

  ngOnInit() {
    this.loading = false;
    this.persona = new Persona();
    this.viewScrollTop();
  }

  ngAfterViewInit() {

  }

  resolved(captchaResponse: string) {
    this.captchaResponse = captchaResponse;
  }

  send(content) {
    this.loading = true;
    this.identidadService.send(this.persona, this.captcha).subscribe(res => {
      this.loading = false;

      if (res.success) {
        this.mensaje = res.message;
        this.open(content, res);
      } else {
        this.mensaje = res.message;
        this.refreshCaptcha();
        this.open(content, res);
      }

    });
  }

  open(content, res: IdentidadRespuesta) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      if (res.success)
        this.router.navigate(['/']);
    }, (reason) => {
      if (res.success)
        this.router.navigate(['/']);
    });
  }

  refreshCaptcha() {
    this.reCaptcha.reset();
  }


  viewScrollTop() {
    window.scrollTo(600, 1);
  }

}
