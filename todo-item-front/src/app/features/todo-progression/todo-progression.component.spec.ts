import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoProgressionComponent } from './todo-progression.component';
import { HttpClientTestingModule, provideHttpClientTesting } from '@angular/common/http/testing';
import { TodoService } from '../../core/services/todo.service';

describe('TodoProgressionComponent', () => {
  let component: TodoProgressionComponent;
  let fixture: ComponentFixture<TodoProgressionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoProgressionComponent, HttpClientTestingModule],
      providers: [TodoService]
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
