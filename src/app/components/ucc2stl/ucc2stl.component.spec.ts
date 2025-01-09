import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ucc2stlComponent } from './ucc2stl.component';

describe('Ucc2stlComponent', () => {
  let component: Ucc2stlComponent;
  let fixture: ComponentFixture<Ucc2stlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ucc2stlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ucc2stlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
