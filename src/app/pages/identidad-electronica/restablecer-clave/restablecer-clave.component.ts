import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MessageService } from 'app/services/MessageService';
import { IdentidadElectronicaService } from 'app/services/identidad-electronica.service';
import { Persona } from 'app/plugins/gestion-clave/persona';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { IdentidadRespuesta } from '../model/Identidad-respuesta.model';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Subscription } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-restablecer-clave',
  templateUrl: './restablecer-clave.component.html',
  styleUrls: ['./restablecer-clave.component.css']
})
export class RestablecerClaveComponent implements OnInit {

  public persona: Persona;
  public loading: boolean;
  public mensaje: string;

  // recaptcha
  // public captchaResponse: string;
  // public captcha: any;
  private subscription: Subscription;
  public recentToken: string = ''
  public recaptchaAvailable = false;
  // @ViewChild('captchaControl') reCaptcha: RecaptchaComponent;

  constructor(
    public messageService: MessageService, 
    private identidadService: IdentidadElectronicaService, 
    private modalService: NgbModal, 
    private router: Router,
    private rcv3Service: ReCaptchaV3Service,
  ) { }

  ngOnInit() {
    this.loading = false;
    this.persona = new Persona();
    this.getRecaptchaToken('registerOAuthReset');
  }

  getRecaptchaToken(action) {
    this.subscription = this.rcv3Service.execute(action).subscribe(response => {
      console.log('response', response);
      
      this.recentToken = response;
      
      this.recaptchaAvailable = true;

      $('.grecaptcha-badge').css({'visibility':'hidden !important'});

      console.log($('.grecaptcha-badge'));

    }, error =>{
      this.recaptchaAvailable = false;
      console.log("error getting recaptcha", error);
    });
  }

  refreshCaptcha() {
    // this.reCaptcha.reset();
    this.getRecaptchaToken('registerOAuthReset');
  }
  
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // resolved(captchaResponse: string) {
  //   this.captchaResponse = captchaResponse;
  // }

  send(content) {
    this.loading = true;
    this.identidadService.send(this.persona, this.recentToken).subscribe(res => {
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

}
