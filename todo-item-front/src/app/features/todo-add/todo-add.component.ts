import { CommonModule } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../core/services/todo.service';
import { CreateTodoItem } from '../../shared/models/todo-item';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-todo-add',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSelectModule],
  templateUrl: './todo-add.component.html',
  styleUrl: './todo-add.component.scss'
})
export class TodoAddComponent {
  todoService = inject(TodoService);
  newTask: CreateTodoItem = { title: '', description: '', category: '' };
  todos: CreateTodoItem[] = [];
  readonly loadTodos = output<boolean>();

  readonly closeAddTaskForm = output<boolean>();

  categories: string[] = ['Work', 'Personal', 'Studies', 'Others'];

  addTask(): void {
    this.todoService.createTodo(this.newTask).subscribe(() => {
      this.newTask = { title: '', description: '', category: '' };
      this.closeAddTaskForm.emit(true);
      this.loadTodos.emit(true);
    });
  }
}
