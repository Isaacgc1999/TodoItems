using TodoListServer.Models;

namespace TodoListServer.Interfaces
{
    public interface ITodoListService
    {
        void AddItem(string title, string description, string category);
        void UpdateItem(int id, string description);
        void RemoveItem(int id);
        void RegisterProgression(int id, DateTime dateTime, float percent);

        TodoItem GetItemById(int id);
        List<TodoItem> GetAllItems();
    }
}
