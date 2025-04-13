import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoListComponent } from './todo-list.component';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, provideHttpClientTesting } from '@angular/common/http/testing';
import { TodoItem, UpdateTodoItem } from '../../shared/models/todo-item';
import { TodoService } from '../../core/services/todo.service';
import { of, throwError } from 'rxjs';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  let todoServiceSpy: jasmine.SpyObj<TodoService>;

  const mockTodos: TodoItem[] = [
    {
      id: 1,
      title: 'Test Todo',
      description: 'Test Description',
      category: 'Work',
      progressions: [],
      totalProgress: 0,
    }
  ];

  beforeEach(() => {
    const spy = jasmine.createSpyObj('TodoService', ['getTodos', 'deleteTodo']);

    TestBed.configureTestingModule({
      imports: [TodoListComponent],
      providers: [
        { provide: TodoService, useValue: spy }
      ]
    });

    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    todoServiceSpy = TestBed.inject(TodoService) as jasmine.SpyObj<TodoService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load todos on init', () => {
    todoServiceSpy.getTodos.and.returnValue(of(mockTodos));

    component.ngOnInit();

    expect(component.todos.length).toBe(1);
    expect(component.todos[0].title).toBe('Test Todo');
  });

  it('should handle error when loading todos', () => {
    spyOn(console, 'error');
    todoServiceSpy.getTodos.and.returnValue(throwError(() => new Error('Load error')));

    component.loadTodos();

    expect(console.error).toHaveBeenCalledWith('There was an error trying to load the items:', jasmine.any(Error));
  });

  it('should delete todo and reload', () => {
    spyOn(component, 'loadTodos');
    todoServiceSpy.deleteTodo.and.returnValue(of(void 0));

    component.deleteTodo(1);

    expect(todoServiceSpy.deleteTodo).toHaveBeenCalledWith(1);
    expect(component.loadTodos).toHaveBeenCalled();
  });

  it('should handle error when deleting todo', () => {
    spyOn(console, 'error');
    todoServiceSpy.deleteTodo.and.returnValue(throwError(() => new Error('Delete error')));

    component.deleteTodo(1);

    expect(console.error).toHaveBeenCalledWith('There was an error trying to delete the item:', jasmine.any(Error));
  });

  it('should open and close the add task form', () => {
    component.openAddTaskForm();
    expect(component.showAddTaskForm).toBeTrue();

    component.closeEditForm();
    expect(component.editingTodo).toBeNull();
  });

  it('should convert todo to UpdateTodoItem and assign to editingTodo', () => {
    const updateTodo: UpdateTodoItem = {
      id: 1,
      title: 'Edit',
      description: 'Edit desc',
      category: 'Work',
      progressions: []
    };

    const result = component.convertTodoToEdit(updateTodo);

    expect(result).toEqual(updateTodo);
    expect(component.editingTodo).toEqual(updateTodo);
  });

  it('should open and close progression form', () => {
    const todo = mockTodos[0];
    component.openAddProgressionForm(todo);
    expect(component.addingProgressionFor).toEqual(todo);

    component.closeAddProgressionForm();
    expect(component.addingProgressionFor).toBeNull();
  });

  it('should validate progression date correctly', () => {
    const validTodo: TodoItem = {
      id: 1,
      title: 'test',
      description: '',
      category: '',
      progressions: [
        { date: new Date('2023-01-01'), percentage: 10 },
        { date: new Date('2023-02-01'), percentage: 20 }
      ],
      totalProgress: 30,
    };

    const invalidTodo: TodoItem = {
      ...validTodo,
      progressions: [
        { date: new Date('2023-01-01'), percentage: 10 },
        { date: new Date('2023-01-02'), percentage: 20 },
        { date: new Date('2023-01-01'), percentage: 30 } 
      ],
      totalProgress: 60,
    };

    expect(component.isNewProgressionDateInvalid(validTodo)).toBeTrue();
  });
});
