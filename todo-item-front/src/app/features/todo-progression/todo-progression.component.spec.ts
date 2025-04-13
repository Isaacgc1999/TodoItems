import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoProgressionComponent } from './todo-progression.component';
import { TodoService } from '../../core/services/todo.service';
import { of, throwError } from 'rxjs';
import { Progression } from '../../shared/models/progression';
import { TodoItem } from '../../shared/models/todo-item';
import { Component, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TodoProgressionComponent', () => {
  let component: TodoProgressionComponent;
  let fixture: ComponentFixture<TodoProgressionComponent>;
  let todoServiceSpy: jasmine.SpyObj<TodoService>;

  const mockTodo: TodoItem = {
    id: 1,
    title: 'Test Todo',
    description: 'Description',
    category: 'Test',
    progressions: [],
    totalProgress: 0
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('TodoService', ['addProgression']);

    await TestBed.configureTestingModule({
      imports: [TodoProgressionComponent, HttpClientTestingModule],
      providers: [
        { provide: TodoService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoProgressionComponent);
    component = fixture.componentInstance;
    todoServiceSpy = TestBed.inject(TodoService) as jasmine.SpyObj<TodoService>;

    (component as any).todo = () => mockTodo;

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call addProgression and emit events on success', () => {
    const progression: Progression = { date: new Date(), percentage: 50 };
    component.newProgression = progression;

    spyOn(component.loadTodos, 'emit');
    spyOn(component.closeAddProgressionForm, 'emit');
    todoServiceSpy.addProgression.and.returnValue(of(void 0));

    component.saveProgression();

    expect(todoServiceSpy.addProgression).toHaveBeenCalledWith(mockTodo.id, progression);
    expect(component.loadTodos.emit).toHaveBeenCalledWith(true);
    expect(component.closeAddProgressionForm.emit).toHaveBeenCalledWith(true);
  });

  it('should log error if addProgression fails', () => {
    spyOn(console, 'error');
    todoServiceSpy.addProgression.and.returnValue(throwError(() => new Error('Test Error')));

    component.saveProgression();

    expect(console.error).toHaveBeenCalledWith(
      'There was an error trying to add the progression:',
      jasmine.any(Error)
    );
  });

  it('should not call service if progressions are undefined', () => {
    const todoWithoutProgressions = { ...mockTodo, progressions: undefined as any };
    (component as any).todo = () => todoWithoutProgressions;

    component.saveProgression();

    expect(todoServiceSpy.addProgression).not.toHaveBeenCalled();
  });
});
