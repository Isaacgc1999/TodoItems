import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { TodoService } from '../../core/services/todo.service';
import { CreateTodoItem, TodoItem } from '../../shared/models/todo-item';
import { TodoAddComponent } from './todo-add.component';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TodoAddComponent', () => {
  let component: TodoAddComponent;
  let fixture: ComponentFixture<TodoAddComponent>;
  let todoService: jasmine.SpyObj<TodoService>;

  beforeEach(() => {
    const todoServiceSpy = jasmine.createSpyObj('TodoService', ['createTodo']);

    TestBed.configureTestingModule({
      imports: [FormsModule, MatSelectModule, NoopAnimationsModule, MatButtonModule, TodoAddComponent, HttpClientTestingModule],
      providers: [{ provide: TodoService, useValue: todoServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoAddComponent);
    component = fixture.componentInstance;
    todoService = TestBed.inject(TodoService) as jasmine.SpyObj<TodoService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize newTask with empty values', () => {
    expect(component.newTask).toEqual({ title: '', description: '', category: '' });
  });

  it('should have predefined categories', () => {
    expect(component.categories).toEqual(['Work', 'Personal', 'Studies', 'Others']);
  });

  it('should emit closeAddTaskForm event when cancelAddTaskForm.emit(true) is called', () => {
    spyOn(component.closeAddTaskForm, 'emit');
    component.closeAddTaskForm.emit(true);
    expect(component.closeAddTaskForm.emit).toHaveBeenCalledWith(true);
  });

  describe('addTask', () => {
    it('should call todoService.createTodo with newTask', () => {
      const newTask: CreateTodoItem = { title: 'Test Task', description: 'Test Description', category: 'Work' };
      component.newTask = newTask;
      todoService.createTodo.and.returnValue(of({ id: 1, title: 'Test Task', description: 'Test Description', category: 'Work' } as TodoItem));
      component.addTask();
      expect(todoService.createTodo).toHaveBeenCalledWith(newTask);
    });

    it('should reset newTask after successful creation', () => {
      component.newTask = { title: 'Old Title', description: 'Old Description', category: 'Personal' };
      todoService.createTodo.and.returnValue(of({ id: 1, title: 'Test Task', description: 'Test Description', category: 'Work' } as TodoItem));
      component.addTask();
      expect(component.newTask).toEqual({ title: '', description: '', category: '' });
    });

    it('should emit closeAddTaskForm event after successful creation', () => {
      spyOn(component.closeAddTaskForm, 'emit');
      todoService.createTodo.and.returnValue(of({ id: 1, title: 'Test Task', description: 'Test Description', category: 'Work' } as TodoItem));
      component.addTask();
      expect(component.closeAddTaskForm.emit).toHaveBeenCalledWith(true);
    });

    it('should emit loadTodos event after successful creation', () => {
      spyOn(component.loadTodos, 'emit');
      todoService.createTodo.and.returnValue(of({ id: 1, title: 'Test Task', description: 'Test Description', category: 'Work' } as TodoItem));
      component.addTask();
      expect(component.loadTodos.emit).toHaveBeenCalledWith(true);
    });
  });
});