﻿namespace TodoItems.Domain.Interfaces
{
    public interface ITodoList
    {
        void AddItem(int id, string title, string description, string category);
        void UpdateItem(int id, string description);
        void RemoveItem(int id);
        void RegisterProgression(int id, DateTime dateTime, float percent);
        void PrintItems();
    }
}
