
namespace TodoListServer.Models
{
    public class TodoItem
    {
        public int Id { get; }
        public string Title { get; }
        public string Description { get; private set; }
        public string Category { get; }
        public List<Progression> Progressions { get; } = [];

        public bool IsCompleted => TotalProgress >= 100;

        public float TotalProgress => Progressions.Sum(p => p.Percentage);

        public TodoItem(int id, string title, string description, string category)
        {
            Id = id;
            Title = title;
            Description = description;
            Category = category;
        }

        public void UpdateDescription(string newDescription)
        {
            Description = newDescription;
        }

        public void AddProgression(Progression newProgression)
        {
            Progressions.Add(newProgression);
        }
    }
}
