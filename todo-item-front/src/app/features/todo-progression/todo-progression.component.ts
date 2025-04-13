import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {  MatInputModule} from '@angular/material/input';
import { Progression } from '../../shared/models/progression';
import { TodoItem } from '../../shared/models/todo-item';
import { TodoService } from '../../core/services/todo.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-todo-progression',
  standalone: true,
  imports: [FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule],
  templateUrl: './todo-progression.component.html',
  styleUrl: './todo-progression.component.scss'
})
export class TodoProgressionComponent {
  newProgression: Progression = { date: new Date(), percentage: 0 };
  readonly todo = input.required<TodoItem>();
  private todoService = inject(TodoService);
  readonly loadTodos = output<boolean>();

  readonly closeAddProgressionForm = output<boolean>();


  saveProgression(): void {
    if (this.todo().progressions) {
      this.todoService.addProgression(this.todo().id, this.newProgression).subscribe({
        next: () => {
          this.loadTodos.emit(true);
          this.closeAddProgressionForm.emit(true);
        },
        error: (error) => {
          console.error('There was an error trying to add the progression:', error);
        }
      });
    }
  }
}
