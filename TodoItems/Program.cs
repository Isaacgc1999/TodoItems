﻿using TodoItems.Domain.Aggregates;
using TodoItems.Infrastructure;

class Program
{
    static void Main()
    {
        var repo = new InMemoryTodoListRepository();
        var todoList = new TodoList(repo);

        todoList.PrintItems();
    }
}
