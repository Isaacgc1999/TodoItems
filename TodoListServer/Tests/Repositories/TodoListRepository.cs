using Xunit;
using TodoListServer.Models;
using TodoListServer.Repositories;

namespace TodoListServer.Tests.Repositories
{
    public class TodoListRepositoryTests
    {
        private readonly TodoListRepository _repository;

        public TodoListRepositoryTests()
        {
            _repository = new TodoListRepository();

            _repository.AddItem(new TodoItem(_repository.GetNextId(),"Item 1", "Desc 1", "Work"));
            _repository.AddItem(new TodoItem(_repository.GetNextId(), "Item 2", "Desc 2", "Personal"));
        }

        [Fact]
        public void GetNextId_ReturnsIncrementingIds()
        {
            Assert.Equal(1, _repository.GetNextId());
            Assert.Equal(2, _repository.GetNextId());
            Assert.Equal(3, _repository.GetNextId());
        }

        [Fact]
        public void GetAllCategories_ReturnsListOfCategories()
        {
            var categories = _repository.GetAllCategories();
            Assert.NotNull(categories);
            Assert.Equal(4, categories.Count);
            Assert.Contains("Work", categories);
            Assert.Contains("Personal", categories);
            Assert.Contains("Studies", categories);
            Assert.Contains("Others", categories);
        }

        [Fact]
        public void GetItemById_ExistingId_ReturnsTodoItem()
        {
            var newItem = new TodoItem (_repository.GetNextId(), "Test Item", "Test Description", "Work");

            _repository.AddItem(newItem);

            var retrievedItem = _repository.GetItemById(1);

            Assert.NotNull(retrievedItem);
            Assert.Equal(1, retrievedItem.Id);
            Assert.Equal("Test Item", retrievedItem.Title);
            Assert.Equal("Test Description", retrievedItem.Description);
            Assert.Equal("Work", retrievedItem.Category);
        }

        [Fact]
        public void GetItemById_NonExistingId_ThrowsKeyNotFoundException()
        {
            Assert.Throws<KeyNotFoundException>(() => _repository.GetItemById(99));
        }

        [Fact]
        public void AddItem_AddsItemToRepository()
        {
            var newItem = new TodoItem (_repository.GetNextId(), "New Item", "New Description", "Personal");
            _repository.AddItem(newItem);

            var allItems = _repository.GetAllItems();
            Assert.Single(allItems);
            Assert.Equal("New Item", allItems.First().Title);
        }

        [Fact]
        public void RemoveItem_ExistingId_RemovesItem()
        {
            var item1 = new TodoItem (_repository.GetNextId(), "Item 1", "Desc 1", "Work");
            var item2 = new TodoItem (_repository.GetNextId(), "Item 2", "Desc 2", "Personal");
            _repository.AddItem(item1);
            _repository.AddItem(item2);

            _repository.RemoveItem(1);
            var allItems = _repository.GetAllItems();
            Assert.Single(allItems);
            Assert.Equal("Item 2", allItems.First().Title);
        }

        [Fact]
        public void RemoveItem_NonExistingId_ThrowsKeyNotFoundException()
        {
            Assert.Throws<KeyNotFoundException>(() => _repository.RemoveItem(99));
        }

        [Fact]
        public void UpdateItem_ExistingItem_UpdatesDescription()
        {
            var existingItem = new TodoItem (_repository.GetNextId(), "Old Title", "Old Description", "Studies");
            _repository.AddItem(existingItem);
            var updatedItem = new TodoItem (1, "Should Not Update", "New Description", "Should Not Update");

            _repository.UpdateItem(updatedItem);

            var retrievedItem = _repository.GetItemById(1);
            Assert.Equal("Old Title", retrievedItem.Title);
            Assert.Equal("New Description", retrievedItem.Description);
            Assert.Equal("Studies", retrievedItem.Category);
        }

        [Fact]
        public void UpdateItem_NonExistingItem_ThrowsKeyNotFoundException()
        {
            var updatedItem = new TodoItem(99, "","New Description", "");
            Assert.Throws<KeyNotFoundException>(() => _repository.UpdateItem(updatedItem));
        }

        [Fact]
        public void GetAllItems_ReturnsAllAddedItems()
        {
            var item1 = new TodoItem (_repository.GetNextId(), "Item A", "Desc A", "Work");
            var item2 = new TodoItem (_repository.GetNextId(), "Item B", "Desc B", "Personal");
            _repository.AddItem(item1);
            _repository.AddItem(item2);

            var allItems = _repository.GetAllItems();
            Assert.NotNull(allItems);
            Assert.Equal(2, allItems.Count);
            Assert.Contains(allItems, item => item.Title == "Item A");
            Assert.Contains(allItems, item => item.Title == "Item B");
        }

        [Fact]
        public void GetAllItems_NoItems_ReturnsEmptyList()
        {
            var allItems = _repository.GetAllItems();
            Assert.NotNull(allItems);
            Assert.Empty(allItems);
        }
    }
}