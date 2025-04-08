using TodoListServer.Interfaces;
using TodoListServer.Models;

namespace TodoListServer.Repositories
{
    public class TodoListRepository : ITodoListRepository
    {
        private int _currentId = 0;
        private readonly List<string> _categories = ["Work", "Personal", "Studies", "Others"];
        private readonly List<TodoItem> _items = [];

        public int GetNextId()
        {
            return ++_currentId;
        }

        public List<string> GetAllCategories()
        {
            return [.. _categories];
        }

        public TodoItem GetItemById(int id) => _items.FirstOrDefault(item => item.Id == id) 
            ?? throw new KeyNotFoundException("The id was not found.");

        public void AddItem(TodoItem item) => _items.Add(item);

        public void RemoveItem(int id)
        {
            var itemToRemove = GetItemById(id);
            if (itemToRemove != null)
            {
                _items.Remove(itemToRemove);
            }
        }

        public void UpdateItem(TodoItem item)
        {
            var existingItem = GetItemById(item.Id);
            if (existingItem != null)
            {
                existingItem.UpdateDescription(item.Description);
                existingItem.Progressions.Clear();
                existingItem.Progressions.AddRange(item.Progressions);
            }
        }

        public List<TodoItem> GetAllItems() => _items;
    }
}
