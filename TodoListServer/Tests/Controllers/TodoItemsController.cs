using Microsoft.AspNetCore.Mvc;
using Moq;
using TodoListServer.Controllers;
using TodoListServer.Interfaces;
using TodoListServer.Models;
using Xunit;

namespace TodoListServer.Tests.Controllers
{
    public class TodoItemsControllerTests
    {
        private readonly Mock<ITodoListService> _mockService;
        private readonly TodoItemsController _controller;

        public TodoItemsControllerTests()
        {
            _mockService = new Mock<ITodoListService>();
            _controller = new TodoItemsController(_mockService.Object);
        }

        [Fact]
        public void GetTodoItems_ReturnsOkResultWithItems()
        {
            // Arrange
            var items = new List<TodoItem> { new TodoItem(1, "Title", "Desc", "Work") };
            _mockService.Setup(service => service.GetAllItems()).Returns(items);

            // Act
            var result = _controller.GetTodoItems();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(items, okResult.Value);
        }

        [Fact]
        public void GetTodoItem_ExistingId_ReturnsOkResultWithItem()
        {
            // Arrange
            var item = new TodoItem(1, "Title", "Desc", "Work");
            _mockService.Setup(service => service.GetItemById(1)).Returns(item);

            // Act
            var result = _controller.GetTodoItem(1);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(item, okResult.Value);
        }

        [Fact]
        public void GetTodoItem_NonExistingId_ReturnsNotFoundResult()
        {
            // Arrange
            _mockService.Setup(service => service.GetItemById(1)).Throws(new KeyNotFoundException());

            // Act
            var result = _controller.GetTodoItem(1);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public void PostTodoItem_ValidModel_ReturnsCreatedAtAction()
        {
            // Arrange
            var newItem = new TodoItem(0, "New Title", "New Desc", "Personal");
            var createdItem = new TodoItem(1, "New Title", "New Desc", "Personal");
            _mockService.Setup(service => service.GetAllItems()).Returns(new List<TodoItem> { createdItem }); // Simulate item being added
            _mockService.Setup(service => service.AddItem(newItem.Title, newItem.Description, newItem.Category));
            _mockService.Setup(service => service.GetItemById(1)).Returns(createdItem); // Simulate retrieval after creation

            // Act
            var result = _controller.PostTodoItem(newItem);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            Assert.Equal(nameof(_controller.GetTodoItem), createdAtActionResult.ActionName);
            Assert.Equal(1, createdAtActionResult.RouteValues["id"]);
            Assert.Equal(createdItem, createdAtActionResult.Value);
            _mockService.Verify(service => service.AddItem(newItem.Title, newItem.Description, newItem.Category), Times.Once);
        }

        [Fact]
        public void PostTodoItem_InvalidCategory_ReturnsBadRequest()
        {
            // Arrange
            var invalidItem = new TodoItem(0, "New Title", "New Desc", "Invalid");
            _mockService.Setup(service => service.AddItem(invalidItem.Title, invalidItem.Description, invalidItem.Category)).Throws(new ArgumentException("The inserted category is not valid."));

            // Act
            var result = _controller.PostTodoItem(invalidItem);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result.Result);
            _mockService.Verify(service => service.AddItem(invalidItem.Title, invalidItem.Description, invalidItem.Category), Times.Once);
        }

        [Fact]
        public void PutTodoItem_ExistingIdValidUpdate_ReturnsOk()
        {
            // Arrange
            var existingItem = new TodoItem(1, "Old Title", "Old Desc", "Work");
            _mockService.Setup(service => service.GetItemById(1)).Returns(existingItem);
            _mockService.Setup(service => service.GetAllItems()).Returns(new List<TodoItem> { existingItem }); // Simulate updated list

            // Act
            var result = _controller.PutTodoItem(1, new TodoItem(1, "Ignored", "New Desc", "Ignored"));

            // Assert
            Assert.IsType<OkObjectResult>(result);
            _mockService.Verify(service => service.UpdateItem(1, "New Desc"), Times.Once);
        }

        [Fact]
        public void PutTodoItem_NonExistingId_ReturnsNotFound()
        {
            // Arrange
            _mockService.Setup(service => service.GetItemById(1)).Throws(new KeyNotFoundException());

            // Act
            var result = _controller.PutTodoItem(1, new TodoItem(1, "Ignored", "New Desc", "Ignored"));

            // Assert
            Assert.IsType<NotFoundResult>(result);
            _mockService.Verify(service => service.UpdateItem(1, "New Desc"), Times.Never);
        }

        [Fact]
        public void PutTodoItem_ProgressOver50_ReturnsBadRequest()
        {
            // Arrange
            var existingItem = new TodoItem(1, "Old Title", "Old Desc", "Work") { Progressions = new List<Progression> { new Progression(DateTime.Now, 60) } };
            _mockService.Setup(service => service.GetItemById(1)).Returns(existingItem);
            _mockService.Setup(service => service.UpdateItem(1, "New Desc")).Throws(new InvalidOperationException("You cannot update..."));

            // Act
            var result = _controller.PutTodoItem(1, new TodoItem(1, "Ignored", "New Desc", "Ignored"));

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
            _mockService.Verify(service => service.UpdateItem(1, "New Desc"), Times.Once);
        }
    }
}