namespace TodoListServer.Models
{
    public class Progression
    {
        public DateTime Date { get; }
        public float Percentage { get; }

        public Progression(DateTime date, float percentage)
        {
            Date = date;
            Percentage = percentage;
        }
    }
}
