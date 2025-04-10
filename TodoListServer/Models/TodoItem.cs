
namespace TodoListServer.Models
{
    public class TodoItem
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public List<Progression> Progressions { get; set; } = [];

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
