using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using TodoListServer.Models;
using TodoListServer.Interfaces;
using TodoListServer.Repositories;

namespace TodoListServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TodoItemsController(ITodoListService todoList) : ControllerBase
    {
        private readonly ITodoListService _todoList = todoList;

        [HttpGet]
        public ActionResult<IEnumerable<TodoItem>> GetTodoItems()
        {
            return Ok(_todoList.GetAllItems());
        }

        [HttpGet("{id}")]
        public ActionResult<TodoItem> GetTodoItem(int id)
        {
            try
            {
                var item = _todoList.GetItemById(id);
                if (item == null)
                {
                    return NotFound();
                }
                return Ok(item);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpPost]
        public ActionResult<TodoItem> PostTodoItem([FromBody] TodoItem model)
        {
            try
            {
                _todoList.AddItem(model.Title, model.Description, model.Category);
                var allItems = _todoList.GetAllItems();
                var newItem = allItems.LastOrDefault(t => t.Title == model.Title);
                if (newItem == null) return StatusCode(500);
                return CreatedAtAction(nameof(GetTodoItem), new { id = newItem.Id }, newItem);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public IActionResult PutTodoItem(int id, [FromBody] TodoItem model)
        {
            try
            {
                _todoList.UpdateItem(id, model.Description);
                return Ok(_todoList.GetAllItems());
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteTodoItem(int id)
        {
            try
            {
                _todoList.RemoveItem(id);
                return Ok(_todoList.GetAllItems());
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("{todoItemId}/progressions")]
        public IActionResult PostProgression(int todoItemId, [FromBody] Progression model)
        {
            try
            {
                _todoList.RegisterProgression(todoItemId, model.Date, model.Percentage);
                return Ok(_todoList.GetItemById(todoItemId));
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
