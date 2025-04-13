import { Component, inject, OnInit } from '@angular/core';
import { CreateTodoItem, TodoItem, UpdateTodoItem } from '../../shared/models/todo-item';
import { TodoService } from '../../core/services/todo.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Progression } from '../../shared/models/progression';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import { DatePipe } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TodoEditComponent } from "../todo-edit/todo-edit.component";
import { TodoAddComponent } from '../todo-add/todo-add.component';
import { TodoProgressionComponent } from '../todo-progression/todo-progression.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  imports: [FormsModule,
    MatProgressBarModule,
    DatePipe,
    TodoEditComponent,
    TodoAddComponent,
    TodoProgressionComponent]
})
export class TodoListComponent implements OnInit {
  todoService = inject(TodoService);
  todos: TodoItem[] = [];
  showAddTaskForm = false;
  addingProgressionFor: TodoItem | null = null;
  editingTodo: UpdateTodoItem | null = null;
  newProgression: Progression | null = null;;

  ngOnInit(): void {
    this.loadTodos();
  }

  openAddTaskForm(): void {
    this.showAddTaskForm = true;
  }

  closeEditForm(): void {
    this.editingTodo = null;
  }

  convertTodoToEdit(todo: UpdateTodoItem): UpdateTodoItem {
    let updateItem: UpdateTodoItem = {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      category: todo.category,
      progressions: todo.progressions
    };
    this.editingTodo = updateItem;
    return this.editingTodo;
  }

  isNewProgressionDateInvalid(todo: TodoItem): boolean {
    return todo.progressions.some(p => new Date(p.date) >= new Date(todo.progressions[todo.progressions.length-1] .date));
  }

  loadTodos(): void {
    this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.todos = todos;
      },
      error: (error) => {
        console.error('There was an error trying to load the items:', error);
      }
    });
  }

  deleteTodo(id: number): void {
    this.todoService.deleteTodo(id).subscribe({
      next: () => {
        this.loadTodos();
      },
      error: (error) => {
        console.error('There was an error trying to delete the item:', error);
      }
    });
  }

  openAddProgressionForm(todo: TodoItem): void {
    this.addingProgressionFor = todo;
  }

  closeAddProgressionForm(): void {
    this.addingProgressionFor = null;
  }


}