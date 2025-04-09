import { Component, inject, OnInit } from '@angular/core';
import { CreateTodoItem, TodoItem } from '../../shared/models/todo-item';
import { TodoService } from '../../core/services/todo.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatSelectModule, MatInputModule]
})
export class TodoListComponent implements OnInit {
  todos: TodoItem[] = [];
  editingTodo: TodoItem | null = null;
  addingProgressionFor: TodoItem | null = null;
  todoService = inject(TodoService);
  newTask: CreateTodoItem = { title: '', description: '', category: '' };
  showAddTaskForm = false;

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
      this.todoService.updateTodo(this.editingTodo.id, { description: this.editingTodo.description})
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
  }

  closeAddProgressionForm(): void {
    this.addingProgressionFor = null;
  }

  saveProgression(): void {
    if (this.addingProgressionFor /* && this.newProgressionData.date && this.newProgressionData.percentage !== null */) {
      // Ajusta la llamada al servicio con los datos correctos
      // this.todoService.addProgression(this.addingProgressionFor.id, { date: this.newProgressionData.date, percentage: this.newProgressionData.percentage })
      //   .subscribe(() => {
      //     this.loadTodos();
      //     this.closeAddProgressionForm();
      //   }, (error) => {
      //     console.error('Error al añadir la progresión:', error);
      //   });
      console.warn('Función saveProgression() no completamente implementada.');
      this.closeAddProgressionForm();
      this.loadTodos(); 
    }
  }
}