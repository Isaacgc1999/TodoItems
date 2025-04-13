import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoEditComponent } from './todo-edit.component';
import { HttpClientTestingModule, provideHttpClientTesting } from '@angular/common/http/testing';
import { TodoService } from '../../core/services/todo.service';
import { HttpClientModule } from '@angular/common/http';
import { UpdateTodoItem } from '../../shared/models/todo-item';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';

describe('TodoEditComponent', () => {
  let component: TodoEditComponent;
  let fixture: ComponentFixture<TodoEditComponent>;
  let mockTodo: UpdateTodoItem;
  let todoService: TodoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoEditComponent, HttpClientTestingModule ],
      providers: [TodoService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoEditComponent);
    component = fixture.componentInstance;
    todoService = TestBed.inject(TodoService);

    mockTodo = {id: 1, title: 'Test Todo', description: 'Test Description', category: 'Work', progressions: []};
    Object.defineProperty(component, 'todo', {
      value: mockTodo as unknown as UpdateTodoItem,
      writable: false,
    });
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateTodo and emit events on saveEdit()', () => {
    spyOn(todoService, 'updateTodo').and.returnValue(of({ id: 1, title: 'Updated Todo', description: 'Updated Description', category: 'Work', progressions: [] } as UpdateTodoItem));
    spyOn(component.loadTodos, 'emit');
    spyOn(component.closeEditing, 'emit');

    component.saveEdit();

    expect(todoService.updateTodo).toHaveBeenCalledWith(mockTodo.id, mockTodo);
    expect(component.loadTodos.emit).toHaveBeenCalledWith(true);
    expect(component.closeEditing.emit).toHaveBeenCalledWith(true);
  });

  it('should not call updateTodo if todo has no id', () => {
    (component as any).todo = signal({ ...mockTodo, id: undefined });
    const updateSpy = spyOn(todoService, 'updateTodo');

    component.saveEdit();

    expect(updateSpy).not.toHaveBeenCalled();
  });

  it('should log error if updateTodo fails', () => {
    const error = new Error('Failed update');
    spyOn(todoService, 'updateTodo').and.returnValue(throwError(() => error));
    spyOn(console, 'error');

    component.saveEdit();

    expect(console.error).toHaveBeenCalledWith('There was an error trying to update the item:', error);
  });
});
