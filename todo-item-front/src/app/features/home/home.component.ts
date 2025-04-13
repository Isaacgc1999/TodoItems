import { Component, EventEmitter, Output } from '@angular/core';
import { TodoListComponent } from '../todo-list/todo-list.component';
import { TodoService } from '../../core/services/todo.service';
import { FormsModule, NgModel } from '@angular/forms';
import { CreateTodoItem, TodoItem } from '../../shared/models/todo-item';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TodoListComponent, FormsModule, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private todoService: TodoService) {}

}
