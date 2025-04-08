using TodoListServer.Models;

namespace TodoListServer.Interfaces
{
    public interface ITodoListRepository
    {
        int GetNextId();
        List<string> GetAllCategories();
        TodoItem GetItemById(int id);
        void AddItem(TodoItem item);
        void RemoveItem(int id);
        void UpdateItem(TodoItem item);
        List<TodoItem> GetAllItems();
    }
}
