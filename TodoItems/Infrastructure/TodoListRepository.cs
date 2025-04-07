using TodoItems.Domain.Interfaces;

namespace TodoItems.Infrastructure
{
    public class InMemoryTodoListRepository : ITodoListRepository
    {
        private int _currentId = 0;
        private readonly List<string> _categories = ["Work", "Personal", "Studies", "Others"];

        public int GetNextId()
        {
            Console.WriteLine(_currentId);
            return ++_currentId;
        }

        public List<string> GetAllCategories()
        {
            return _categories;
        }
    }

}
