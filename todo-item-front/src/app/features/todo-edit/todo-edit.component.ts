import { Component, inject, input, output } from '@angular/core';
import { TodoItem, UpdateTodoItem } from '../../shared/models/todo-item';
import { TodoService } from '../../core/services/todo.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-edit',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './todo-edit.component.html',
  styleUrl: './todo-edit.component.scss'
})
export class TodoEditComponent {
  private todoService = inject(TodoService);
  todos: TodoItem[] = [];
  readonly editingTodo = input.required<UpdateTodoItem>();
  readonly closeEditing = output<boolean>();

  saveEdit(): void {
    const edited = this.editingTodo();
    console.log('Saving edit:', this.editingTodo());
    if (edited) {
      this.todoService.updateTodo(edited.id, edited)
        .subscribe({
          next: () => {
            this.loadTodos();
            this.closeEditing.emit(true);
          },
          error: (error) => {
            console.error('There was an error trying to update the item:', error);
          }
        });
    }
  }

  loadTodos(): void {
    this.todoService.todos$.subscribe((todos) => {
      if (todos) this.todos = todos;
    });

    this.todoService.loadTodos();
  }
}
