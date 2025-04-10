using Moq;
using TodoListServer.Interfaces;
using TodoListServer.Models;
using TodoListServer.Services;
using Xunit;

namespace TodoListServer.Tests.Services
{
    public class TodoListServiceTests
    {
        private readonly Mock<ITodoListRepository> _mockRepository;
        private readonly TodoListService _service;

        public TodoListServiceTests()
        {
            _mockRepository = new Mock<ITodoListRepository>();
            _service = new TodoListService(_mockRepository.Object);
        }

        [Fact]
        public void AddItem_ValidCategory_CallsRepositoryAddItem()
        {
            // Arrange
            _mockRepository.Setup(repo => repo.GetAllCategories()).Returns(new List<string> { "Work", "Personal" });
            _mockRepository.Setup(repo => repo.GetNextId()).Returns(1);

            // Act
            _service.AddItem("New Task", "Description", "Work");

            // Assert
            _mockRepository.Verify(repo => repo.GetNextId(), Times.Once);
            _mockRepository.Verify(repo => repo.AddItem(It.Is<TodoItem>(item =>
                item.Id == 1 && item.Title == "New Task" && item.Description == "Description" && item.Category == "Work")), Times.Once);
        }

        [Fact]
        public void AddItem_InvalidCategory_ThrowsArgumentException()
        {
            // Arrange
            _mockRepository.Setup(repo => repo.GetAllCategories()).Returns(new List<string> { "Work", "Personal" });

            // Act & Assert
            Assert.Throws<ArgumentException>(() => _service.AddItem("New Task", "Description", "Invalid"));
            _mockRepository.Verify(repo => repo.AddItem(It.IsAny<TodoItem>()), Times.Never);
        }

        [Fact]
        public void UpdateItem_ExistingItemUnder50Progress_CallsRepositoryUpdateItem()
        {
            // Arrange
            var existingItem = new TodoItem(1, "Old Title", "Old Description", "Work") { Progressions = new List<Progression>() };
            _mockRepository.Setup(repo => repo.GetItemById(1)).Returns(existingItem);

            // Act
            _service.UpdateItem(1, "New Description");

            // Assert
            Assert.Equal("New Description", existingItem.Description);
            _mockRepository.Verify(repo => repo.UpdateItem(existingItem), Times.Once);
        }

        [Fact]
        public void UpdateItem_NonExistingItem_ThrowsKeyNotFoundException()
        {
            // Arrange
            _mockRepository.Setup(repo => repo.GetItemById(1)).Returns((TodoItem)null);

            // Act & Assert
            Assert.Throws<KeyNotFoundException>(() => _service.UpdateItem(1, "New Description"));
            _mockRepository.Verify(repo => repo.UpdateItem(It.IsAny<TodoItem>()), Times.Never);
        }

        [Fact]
        public void UpdateItem_ExistingItemOver50Progress_ThrowsInvalidOperationException()
        {
            // Arrange
            var existingItem = new TodoItem(1, "Old Title", "Old Description", "Work") { Progressions = new List<Progression> { new Progression(DateTime.Now, 60) } };
            _mockRepository.Setup(repo => repo.GetItemById(1)).Returns(existingItem);

            // Act & Assert
            Assert.Throws<InvalidOperationException>(() => _service.UpdateItem(1, "New Description"));
            _mockRepository.Verify(repo => repo.UpdateItem(It.IsAny<TodoItem>()), Times.Never);
        }

        [Fact]
        public void RemoveItem_ExistingItemUnder50Progress_CallsRepositoryRemoveItem()
        {
            // Arrange
            var existingItem = new TodoItem(1, "Title", "Description", "Work") { Progressions = new List<Progression>() };
            _mockRepository.Setup(repo => repo.GetItemById(1)).Returns(existingItem);

            // Act
            _service.RemoveItem(1);

            // Assert
            _mockRepository.Verify(repo => repo.RemoveItem(1), Times.Once);
        }

        [Fact]
        public void RemoveItem_NonExistingItem_ThrowsKeyNotFoundException()
        {
            // Arrange
            _mockRepository.Setup(repo => repo.GetItemById(1)).Returns((TodoItem)null);

            // Act & Assert
            Assert.Throws<KeyNotFoundException>(() => _service.RemoveItem(1));
            _mockRepository.Verify(repo => repo.RemoveItem(It.IsAny<int>()), Times.Never);
        }

        [Fact]
        public void RemoveItem_ExistingItemOver50Progress_ThrowsInvalidOperationException()
        {
            // Arrange
            var existingItem = new TodoItem(1, "Title", "Description", "Work") { Progressions = new List<Progression> { new Progression(DateTime.Now, 60) } };
            _mockRepository.Setup(repo => repo.GetItemById(1)).Returns(existingItem);

            // Act & Assert
            Assert.Throws<InvalidOperationException>(() => _service.RemoveItem(1));
            _mockRepository.Verify(repo => repo.RemoveItem(It.IsAny<int>()), Times.Never);
        }

        [Fact]
        public void RegisterProgression_ExistingItemValidPercentageNewDate_CallsRepositoryUpdateItem()
        {
            // Arrange
            var existingItem = new TodoItem(1, "Title", "Description", "Work") { Progressions = new List<Progression>() };
            _mockRepository.Setup(repo => repo.GetItemById(1)).Returns(existingItem);
            var newDateTime = DateTime.Now.AddDays(1);

            // Act
            _service.RegisterProgression(1, newDateTime, 20);

            // Assert
            Assert.Single(existingItem.Progressions);
            Assert.Equal(newDateTime.Date, existingItem.Progressions.First().Date.Date);
            Assert.Equal(20, existingItem.Progressions.First().Percentage);
            _mockRepository.Verify(repo => repo.UpdateItem(existingItem), Times.Once);
        }

        [Fact]
        public void RegisterProgression_NonExistingItem_ThrowsKeyNotFoundException()
        {
            // Arrange
            _mockRepository.Setup(repo => repo.GetItemById(1)).Returns((TodoItem)null);

            // Act & Assert
            Assert.Throws<KeyNotFoundException>(() => _service.RegisterProgression(1, DateTime.Now, 20));
            _mockRepository.Verify(repo => repo.UpdateItem(It.IsAny<TodoItem>()), Times.Never);
        }

        [Theory]
        [InlineData(0)]
        [InlineData(101)]
        public void RegisterProgression_InvalidPercentage_ThrowsArgumentOutOfRangeException(float percent)
        {
            // Arrange
            var existingItem = new TodoItem(1, "Title", "Description", "Work") { Progressions = new List<Progression>() };
            _mockRepository.Setup(repo => repo.GetItemById(1)).Returns(existingItem);

            // Act & Assert
            Assert.Throws<ArgumentOutOfRangeException>(() => _service.RegisterProgression(1, DateTime.Now, percent));
            _mockRepository.Verify(repo => repo.UpdateItem(It.IsAny<TodoItem>()), Times.Never);
        }

        [Fact]
        public void RegisterProgression_DateNotGreaterThanLast_ThrowsArgumentException()
        {
            // Arrange
            var now = DateTime.Now;
            var existingItem = new TodoItem(1, "Title", "Description", "Work") { Progressions = new List<Progression> { new Progression(now, 30) } };
            _mockRepository.Setup(repo => repo.GetItemById(1)).Returns(existingItem);

            // Act & Assert
            Assert.Throws<ArgumentException>(() => _service.RegisterProgression(1, now, 20));
            Assert.Throws<ArgumentException>(() => _service.RegisterProgression(1, now.AddDays(-1), 20));
            _mockRepository.Verify(repo => repo.UpdateItem(It.IsAny<TodoItem>()), Times.Never);
        }

        [Fact]
        public void RegisterProgression_Surpasses100Percent_ThrowsArgumentException()
        {
            // Arrange
            var now = DateTime.Now;
            var existingItem = new TodoItem(1, "Title", "Description", "Work") { Progressions = new List<Progression> { new Progression(now, 85) } };
            _mockRepository.Setup(repo => repo.GetItemById(1)).Returns(existingItem);
            var newDateTime = now.AddDays(1);

            // Act & Assert
            Assert.Throws<ArgumentException>(() => _service.RegisterProgression(1, newDateTime, 20));
            _mockRepository.Verify(repo => repo.UpdateItem(It.IsAny<TodoItem>()), Times.Never);
        }

        [Fact]
        public void RegisterProgression_DuplicateEntry_DoesNotAddItem()
        {
            // Arrange
            var now = DateTime.Now;
            var existingItem = new TodoItem(1, "Title", "Description", "Work") { Progressions = new List<Progression> { new Progression(now, 30) } };
            _mockRepository.Setup(repo => repo.GetItemById(1)).Returns(existingItem);

            // Act
            _service.RegisterProgression(1, now, 30);

            // Assert
            Assert.Single(existingItem.Progressions);
            _mockRepository.Verify(repo => repo.UpdateItem(It.IsAny<TodoItem>()), Times.Never);
        }

        [Fact]
        public void GetItemById_CallsRepositoryGetItemById()
        {
            // Arrange
            var expectedItem = new TodoItem(1, "Title", "Description", "Work");
            _mockRepository.Setup(repo => repo.GetItemById(1)).Returns(expectedItem);

            // Act
            var result = _service.GetItemById(1);

            // Assert
            Assert.Equal(expectedItem, result);
            _mockRepository.Verify(repo => repo.GetItemById(1), Times.Once);
        }

        [Fact]
        public void GetAllItems_CallsRepositoryGetAllItems()
        {
            // Arrange
            var expectedItems = new List<TodoItem> { new TodoItem(1, "Title", "Desc", "Work") };
            _mockRepository.Setup(repo => repo.GetAllItems()).Returns(expectedItems);

            // Act
            var result = _service.GetAllItems();

            // Assert
            Assert.Equal(expectedItems, result);
            _mockRepository.Verify(repo => repo.GetAllItems(), Times.Once);
        }
    }
}