import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoProgressionComponent } from './todo-progression.component';

describe('TodoProgressionComponent', () => {
  let component: TodoProgressionComponent;
  let fixture: ComponentFixture<TodoProgressionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoProgressionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoProgressionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
