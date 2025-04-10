import { Component, inject, OnInit } from '@angular/core';
import { CreateTodoItem, TodoItem } from '../../shared/models/todo-item';
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

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  standalone: true,
  imports: [FormsModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatSliderModule,
    DatePipe,
    MatProgressBarModule]
})
export class TodoListComponent implements OnInit {
  todoService = inject(TodoService);
  todos: TodoItem[] = [];
  editingTodo: TodoItem | null = null;
  newProgression: Progression = { date: new Date(), percentage: 0 };
  newTask: CreateTodoItem = { title: '', description: '', category: '' };
  showAddTaskForm = false;
  addingProgressionFor: TodoItem | null = null;

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

  openEditForm(todo: TodoItem): void {
    this.editingTodo = { ...todo };
  }

  closeEditForm(): void {
    this.editingTodo = null;
  }

  saveEdit(): void {
    if (this.editingTodo) {
      this.todoService.updateTodo(this.editingTodo.id, this.editingTodo)
        .subscribe({
          next: () => {
            this.loadTodos();
            this.closeEditForm();
          },
          error: (error) => {
            console.error('There was an error trying to update the item:', error);
          }
        });
    }
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