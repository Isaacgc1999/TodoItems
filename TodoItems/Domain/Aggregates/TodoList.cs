using TodoItems.Domain.Interfaces;
using TodoItems.Domain.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace TodoItems.Domain.Aggregates
{
    public class TodoList(ITodoListRepository repository) : ITodoList
    {
        private readonly ITodoListRepository _repository = repository;
        private readonly List<TodoItem> _items = [];

        public void AddItem(int id, string title, string description, string category)
        {
            if (!_repository.GetAllCategories().Contains(category))
            {
                throw new ArgumentException("The inserted category is not valid.");
            }

            var newItem = new TodoItem(id, title, description, category);
            _items.Add(newItem);
        }

        public void UpdateItem(int id, string description)
        {
            var item = _items.FirstOrDefault(x => x.Id == id) 
                ?? throw new KeyNotFoundException("The requested Item was not found.");

            if(item.TotalProgress > 50)
            {
                throw new InvalidOperationException("You cannot update any item with more than 50% of progress");
            }

            item.UpdateDescription(description);
        }

        public void RemoveItem(int id)
        {
            var item = _items.FirstOrDefault(x => x.Id == id)
                ?? throw new KeyNotFoundException("The requested Item was not found.");

            if (item.TotalProgress > 50)
            {
                throw new InvalidOperationException("You cannot delete any item with more than 50% of progress");
            }

            _items.Remove(item);
        }

        public void RegisterProgression(int id, DateTime dateTime, float percent)
        {
            var item = _items.FirstOrDefault(x => x.Id == id)
                ?? throw new KeyNotFoundException("The requested Item was not found.");

            var progression = new Progression(dateTime, percent);
            item.AddProgression(progression);
        }

        public void PrintItems()
        {
            foreach(var item in _items.OrderBy(i => i.Id))
            {
                Console.WriteLine($"{item.Id}) {item.Title} - {item.Description} ({item.Category}) Completed:{item.IsCompleted}");

                float currentProgress = 0;

                foreach (var progression in item.Progressions)
                {
                    currentProgress += progression.Percentage;
                    var time = progression.Date.ToString("h:mm tt");

                    Console.WriteLine($"{DateOnly.FromDateTime(progression.Date)} {time} - {currentProgress}% | {new string('O', (int)currentProgress)}|");
                }
                Console.WriteLine("");
            }

        }
    }

}
