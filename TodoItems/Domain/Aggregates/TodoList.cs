using TodoItems.Domain.Interfaces;
using TodoItems.Domain.Models;

namespace TodoItems.Domain.Aggregates
{
    public class TodoList(ITodoListRepository repository) : ITodoList
    {
        private readonly ITodoListRepository _repository = repository;
        private readonly List<TodoItem> _items = [];

        public void AddItem(int id, string title, string description, string category)
        {
            // future validations
        }

        public void UpdateItem(int id, string description)
        {
            // logic
        }

        public void RemoveItem(int id)
        {
            // logic
        }

        public void RegisterProgression(int id, DateTime dateTime, decimal percent)
        {
            // logic
        }

        public void PrintItems()
        {
            // Show the list of items
        }
    }

}
