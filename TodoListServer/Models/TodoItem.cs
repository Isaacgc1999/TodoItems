
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
            if(newProgression.Percentage <= 0 || newProgression.Percentage > 100)
            {
                throw new ArgumentException("The percentage must be a number between 0 and 100");
            }

            if(Progressions.Count > 0 && newProgression.Date <= Progressions[Progressions.Count - 1].Date)
            {
                throw new ArgumentException("The date of the new progression must be greater to the last one");
            }

            if (TotalProgress + newProgression.Percentage > 100)
            {
                throw new ArgumentException("Cannot surpass the 100% of progress");
            }

            Progressions.Add(newProgression);
        }
    }
}
