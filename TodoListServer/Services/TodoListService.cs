using TodoListServer.Models;
using TodoListServer.Interfaces;

namespace TodoListServer.Services
{
    public class TodoList(ITodoListRepository repository) : ITodoListService
    {
        private readonly ITodoListRepository _repository = repository;

        public void AddItem(string title, string description, string category)
        {
            if (!_repository.GetAllCategories().Contains(category, StringComparer.OrdinalIgnoreCase))
            {
                throw new ArgumentException("The inserted category is not valid.");
            }

            var nextId = _repository.GetNextId();
            var newItem = new TodoItem(nextId, title, description, category);
            _repository.AddItem(newItem);
        }

        public void UpdateItem(int id, string description)
        {
            var item = _repository.GetItemById(id)
                       ?? throw new KeyNotFoundException($"The requested Item with ID {id} was not found.");

            if (item.TotalProgress > 50)
            {
                throw new InvalidOperationException($"You cannot update the item with ID {id} as it has more than 50% progress.");
            }

            item.UpdateDescription(description);
            _repository.UpdateItem(item);
        }

        public void RemoveItem(int id)
        {
            var item = _repository.GetItemById(id)
                       ?? throw new KeyNotFoundException($"The requested Item with ID {id} was not found.");

            if (item.TotalProgress > 50)
            {
                throw new InvalidOperationException($"You cannot delete the item with ID {id} as it has more than 50% progress.");
            }

            _repository.RemoveItem(id);
        }

        public void RegisterProgression(int id, DateTime dateTime, float percent)
        {
            var item = _repository.GetItemById(id)
                       ?? throw new KeyNotFoundException($"The requested Item with ID {id} was not found.");

            var newProgression = new Progression(dateTime, percent);
            item.AddProgression(newProgression);
            _repository.UpdateItem(item);
        }

        public TodoItem GetItemById(int id)
        {
            return _repository.GetItemById(id);
        }

        public List<TodoItem> GetAllItems()
        {
            return _repository.GetAllItems();
        }
    }
}
