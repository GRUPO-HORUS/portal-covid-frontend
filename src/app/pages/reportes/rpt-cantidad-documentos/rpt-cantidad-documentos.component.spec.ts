import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RptCantidadDocumentosComponent } from './rpt-cantidad-documentos.component';

describe('RptCantidadDocumentosComponent', () => {
  let component: RptCantidadDocumentosComponent;
  let fixture: ComponentFixture<RptCantidadDocumentosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RptCantidadDocumentosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RptCantidadDocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
