import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TodoService } from './todo.service';
import { environment } from '../../../environments/environment';
import { CreateTodoItem, TodoItem, UpdateTodoItem } from '../../shared/models/todo-item';
import { Progression } from '../../shared/models/progression';

describe('TodoService', () => {
  let service: TodoService;
  let httpMock: HttpTestingController;

  const mockTodos: TodoItem[] = [
    { id: 1, title: 'Test 1', description: 'Desc 1', category: 'A', progressions: [], totalProgress: 0 },
    { id: 2, title: 'Test 2', description: 'Desc 2', category: 'B', progressions: [], totalProgress: 0 }
  ];

  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodoService]
    });

    service = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all todos', () => {
    service.getTodos().subscribe(todos => {
      expect(todos.length).toBe(2);
      expect(todos).toEqual(mockTodos);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockTodos);
  });

  it('should get a todo by id', () => {
    const id = 1;
    service.getTodo(id).subscribe(todo => {
      expect(todo).toEqual(mockTodos[0]);
    });

    const req = httpMock.expectOne(`${apiUrl}/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTodos[0]);
  });

  it('should create a todo', () => {
    const newTodo: CreateTodoItem = {
      title: 'New',
      description: 'New Desc',
      category: 'New'
    };

    const createdTodo: TodoItem = { id: 3, progressions: [], totalProgress: 0, ...newTodo };

    service.createTodo(newTodo).subscribe(todo => {
      expect(todo).toEqual(createdTodo);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTodo);
    req.flush(createdTodo);
  });

  it('should update a todo', () => {
    const id = 1;
    const update: UpdateTodoItem = {
      id,
      title: 'Updated',
      description: 'Updated Desc',
      category: 'Updated',
      progressions: []
    };

    service.updateTodo(id, update).subscribe(result => {
      expect(result).toEqual(update);
    });

    const req = httpMock.expectOne(`${apiUrl}/${id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(update);
    req.flush(update);
  });
});
