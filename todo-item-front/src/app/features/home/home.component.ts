import { Component, EventEmitter, Output } from '@angular/core';
import { TodoListComponent } from '../todo-list/todo-list.component';
import { TodoService } from '../../core/services/todo.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { CreateTodoItem, TodoItem } from '../../shared/models/todo-item';

@Component({
  selector: 'app-home',
  imports: [TodoListComponent, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  newTask: CreateTodoItem = { title: '', description: '', category: '' };
  showAddTaskForm = false;
  @Output() taskAdded = new EventEmitter<TodoItem>();

  constructor(private todoService: TodoService) {}

  openAddTaskForm(): void {
    this.showAddTaskForm = true;
    this.newTask = { title: '', description: '', category: '' };
  }

  closeAddTaskForm(): void {
    this.showAddTaskForm = false;
  }

  addTask(): void {
    this.todoService.createTodo(this.newTask).subscribe(() => {
      this.taskAdded.emit(this.newTask as TodoItem);
      this.newTask = { title: '', description: '', category: '' };
      this.closeAddTaskForm();
    });
  }
}
