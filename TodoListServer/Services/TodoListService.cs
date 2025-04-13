using TodoListServer.Models;
using TodoListServer.Interfaces;

namespace TodoListServer.Services
{
    public class TodoListService(ITodoListRepository repository) : ITodoListService
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

            if (percent <= 0 || percent > 100)
            {
                throw new ArgumentOutOfRangeException(nameof(percent), "The percentage must be a number between 0 and 100");
            }

            if (item.Progressions.Any() && dateTime <= item.Progressions.Last().Date)
            {
                throw new ArgumentException("The date of the new progression must be greater than the last one");
            }

            if (item.TotalProgress + percent > 100)
            {
                throw new ArgumentException("Cannot surpass the 100% of progress");
            }

            if (!item.Progressions.Any(p => p.Date == dateTime && Math.Abs(p.Percentage - percent) < 0.001))
            {
                var previousTotal = item.Progressions.Sum(p => p.Percentage);
                var newTotal = previousTotal + percent;
                var newProgression = new Progression(dateTime, newTotal);
                item.AddProgression(newProgression);
            }
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
