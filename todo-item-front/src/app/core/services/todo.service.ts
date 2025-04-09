import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateTodoItem, TodoItem, UpdateTodoItem } from '../../shared/models/todo-item';
import { Observable, tap } from 'rxjs';
import { Progression } from '../../shared/models/progression';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTodos(): Observable<TodoItem[]> {
    return this.http.get<TodoItem[]>(this.apiUrl).pipe(
      tap(todos => console.log('Todos fetched:', todos)),
    );
  }

  getTodo(id: number): Observable<TodoItem> {
    return this.http.get<TodoItem>(`${this.apiUrl}/${id}`);
  }

  createTodo(todo: CreateTodoItem): Observable<TodoItem> {
    return this.http.post<TodoItem>(this.apiUrl, todo);
  }

  updateTodo(id: number, todo: UpdateTodoItem): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, todo);
  }

  deleteTodo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  addProgression(todoItemId: number, progression: Progression): Observable<any> {
    return this.http.post(`${this.apiUrl}/${todoItemId}/progressions`, progression);
  }
}
