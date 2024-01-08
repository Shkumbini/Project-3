import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterBuyerComponent } from './register-buyer.component';

describe('RegisterBuyerComponent', () => {
  let component: RegisterBuyerComponent;
  let fixture: ComponentFixture<RegisterBuyerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterBuyerComponent]
    });
    fixture = TestBed.createComponent(RegisterBuyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
