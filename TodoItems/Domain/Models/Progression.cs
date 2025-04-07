namespace TodoItems.Domain.Models
{
    public class Progression
    {
        public DateTime Date { get; }
        public float Percent { get; }

        public Progression(DateTime date, float percent)
        {
            Date = date;
            Percent = percent;
        }
    }
}
