package com.example.todolist.controller;

import com.example.todolist.model.Todo;
import com.example.todolist.service.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = "*")
public class TodoController {
    
    @Autowired
    private TodoService todoService;
    
    @GetMapping
    public List<Todo> getAllTodos() {
        return todoService.getAllTodos();
    }
    
    @GetMapping("/completed/{completed}")
    public List<Todo> getTodosByCompleted(@PathVariable boolean completed) {
        return todoService.getTodosByCompleted(completed);
    }
    
    @GetMapping("/category/{category}")
    public List<Todo> getTodosByCategory(@PathVariable String category) {
        return todoService.getTodosByCategory(category);
    }
    
    @GetMapping("/priority/{priority}")
    public List<Todo> getTodosByPriority(@PathVariable String priority) {
        return todoService.getTodosByPriority(priority);
    }
    
    @PostMapping
    public Todo createTodo(@RequestBody Todo todo) {
        return todoService.saveTodo(todo);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Todo> getTodoById(@PathVariable Long id) {
        return todoService.getTodoById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Todo> updateTodo(@PathVariable Long id, @RequestBody Todo todoDetails) {
        try {
            Todo updatedTodo = todoService.updateTodo(id, todoDetails);
            return ResponseEntity.ok(updatedTodo);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        todoService.deleteTodo(id);
        return ResponseEntity.ok().build();
    }
} 