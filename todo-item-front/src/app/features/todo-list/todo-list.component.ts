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

@Component({
  selector: 'app-todo-list',
  standalone: true,
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  imports: [FormsModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatSliderModule,
    DatePipe,
    MatProgressBarModule, TodoEditComponent]
})
export class TodoListComponent implements OnInit {
  todoService = inject(TodoService);
  todos: TodoItem[] = [];
  newProgression: Progression = { date: new Date(), percentage: 0 };
  newTask: CreateTodoItem = { title: '', description: '', category: '' };
  showAddTaskForm = false;
  addingProgressionFor: TodoItem | null = null;
  editingTodo: UpdateTodoItem | null = null;

  categories: string[] = ['Work', 'Personal', 'Studies', 'Others'];

  ngOnInit(): void {
    this.loadTodos();
  }

  openAddTaskForm(): void {
    this.showAddTaskForm = true;
    this.newTask = { title: '', description: '', category: '' };
  }

  closeAddTaskForm(): void {
    this.showAddTaskForm = false;
  }

  addTask(): void {
    this.todoService.createTodo(this.newTask).subscribe(() => {
      this.newTask = { title: '', description: '', category: '' };
      this.closeAddTaskForm();
      this.loadTodos();
    });
  }

  openEditForm(todo: UpdateTodoItem): void {
    this.editingTodo = this.convertTodoToEdit(todo);
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
    return updateItem;
  }

  loadTodos(): void {
    this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.todos = todos;
        console.log(this.todos);
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
    this.newProgression = { date: new Date(), percentage: 0 }; 
  }

  closeAddProgressionForm(): void {
    this.addingProgressionFor = null;
  }

  saveProgression(): void {
    if (this.addingProgressionFor) {
      this.todoService.addProgression(this.addingProgressionFor.id, this.newProgression).subscribe({
        next: () => {
          this.loadTodos();
          this.closeAddProgressionForm();
        },
        error: (error) => {
          console.error('There was an error trying to add the progression:', error);
        }
      });
    }
  }
}