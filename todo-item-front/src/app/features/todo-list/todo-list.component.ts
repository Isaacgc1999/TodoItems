import { Component, inject, OnInit } from '@angular/core';
import { TodoItem } from '../../shared/models/todo-item';
import { TodoService } from '../../core/services/todo.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  standalone: true,
  imports: [FormsModule]
})
export class TodoListComponent implements OnInit {
  todos: TodoItem[] = [];
  editingTodo: TodoItem | null = null;
  addingProgressionFor: TodoItem | null = null;
  todoService = inject(TodoService);

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.todos = todos;
      },
      error: (error) => {
        console.error('Error al cargar las tareas:', error);
      },
      complete: () => {
        console.log('Carga de tareas completada');
      }
    });
  }

  deleteTodo(id: number): void {
    this.todoService.deleteTodo(id).subscribe(
      () => {
        this.loadTodos();
      },
      (error) => {
        console.error('Error al eliminar la tarea:', error);
      }
    );
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
        .subscribe(() => {
          this.loadTodos();
          this.closeEditForm();
        }, (error) => {
          console.error('Error al guardar la edición:', error);
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