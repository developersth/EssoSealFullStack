import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SealoutComponent } from './sealout.component';

describe('SealoutComponent', () => {
  let component: SealoutComponent;
  let fixture: ComponentFixture<SealoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SealoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SealoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
