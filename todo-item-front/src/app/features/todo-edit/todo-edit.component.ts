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
  readonly todo = input.required<UpdateTodoItem>();
  readonly closeEditing = output<boolean>();
  readonly loadTodos = output<boolean>();

  // todoEdit: UpdateTodoItem = {id: 0, title: '', description: '', category: '', progressions: []};

  saveEdit(): void {
    if (this.todo().id) {
      this.todoService.updateTodo(this.todo().id, this.todo())
        .subscribe({
          next: () => {
            this.loadTodos.emit(true);
            this.closeEditing.emit(true);
          },
          error: (error) => {
            console.error('There was an error trying to update the item:', error);
          }
        });
    }
  }
}
