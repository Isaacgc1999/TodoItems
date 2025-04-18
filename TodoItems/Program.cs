﻿using TodoItems.Domain.Aggregates;
using TodoItems.Domain.Interfaces;
using TodoItems.Infrastructure;

class Program
{
    public static readonly ITodoListRepository repo = new TodoListRepository();
    public static readonly ITodoList todoList = new TodoList(repo);

    static void Main()
    {
        while (true)
        {
            Console.WriteLine("\n--- Todo List Manager ---");
            Console.WriteLine("1. Add a new Item (Select one of these categories: \"Work\", \"Personal\", \"Studies\", \"Others\")");
            Console.WriteLine("2. Update description of an item");
            Console.WriteLine("3. Delete an item");
            Console.WriteLine("4. Register progress of an item");
            Console.WriteLine("5. Show all the items");
            Console.WriteLine("6. Exit");
            Console.WriteLine("");
            Console.Write("Select an option: ");

            string selection = Console.ReadLine() ?? "";

            switch (selection)
            {
                case "1":
                    AddTodoItem(todoList);
                    break;
                case "2":
                    UpdateTodoItemDescription(todoList);
                    break;
                case "3":
                    RemoveTodoItem(todoList);
                    break;
                case "4":
                    RegisterProgression(todoList);
                    break;
                case "5":
                    todoList.PrintItems();
                    break;
                case "6":
                    Console.WriteLine("Exiting the app.");
                    return;
                default:
                    Console.WriteLine("Invalid option. Please, try again.");
                    break;
            }
        }
    }

    static void AddTodoItem(ITodoList todoListManager)
    {
        int id = repo.GetNextId();

        Console.WriteLine("\n--- Add new item ---");
        Console.Write("Title: ");
        string title = Console.ReadLine() ?? "";
        Console.Write("Description: ");
        string description = Console.ReadLine() ?? "";
        Console.Write("Category: ");
        string category = Console.ReadLine() ?? "";

        try
        {
            todoListManager.AddItem(id, title, description, category);
            Console.WriteLine("Item added correctly.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"There was an error trying to add the item: {ex.Message}");
        }
    }

    static void UpdateTodoItemDescription(ITodoList todoListManager)
    {
        Console.WriteLine("\n--- Modify the description of an item ---");
        Console.Write("Please, insert the id of the item you want to modify: ");
        if (int.TryParse(Console.ReadLine(), out int id))
        {
            Console.Write("Now insert the desired description: ");
            string newDescription = Console.ReadLine() ?? "";
            try
            {
                todoListManager.UpdateItem(id, newDescription);
                Console.WriteLine("Item's description updated correctly.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"There was a problem trying to update the item: {ex.Message}");
            }
        }
        else
        {
            Console.WriteLine("Invalid ID.");
        }
    }

    static void RemoveTodoItem(ITodoList todoListManager)
    {
        Console.WriteLine("\n--- Delete an item ---");
        Console.Write("Please, add the id of the item you want to delete: ");
        if (int.TryParse(Console.ReadLine(), out int id))
        {
            try
            {
                todoListManager.RemoveItem(id);
                Console.WriteLine("The item was correctly deleted.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"There was a problem trying to delete the item: {ex.Message}");
            }
        }
        else
        {
            Console.WriteLine("Invalid ID.");
        }
    }

    static void RegisterProgression(ITodoList todoListManager)
    {
        Console.WriteLine("\n--- Register progress in an item ---");
        Console.Write("Insert the id of the item: ");
        if (int.TryParse(Console.ReadLine(), out int id))
        {
            Console.Write("Insert the progression's date (yyyy-MM-dd HH:mm): ");
            if (DateTime.TryParse(Console.ReadLine(), out DateTime date))
            {
                Console.Write("Now insert the percentage that was completed that day: ");
                if (float.TryParse(Console.ReadLine(), out float percentage))
                {
                    try
                    {
                        todoListManager.RegisterProgression(id, date, percentage);
                        Console.WriteLine("The progress was noted.");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"There was a problem trying to register the progress: {ex.Message}");
                    }
                }
                else
                {
                    Console.WriteLine("Invalid Percentage.");
                }
            }
            else
            {
                Console.WriteLine("Invalid Date.");
            }
        }
        else
        {
            Console.WriteLine("Invalid ID.");
        }
    }
}
