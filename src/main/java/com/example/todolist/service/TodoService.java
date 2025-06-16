package com.example.todolist.service;

import com.example.todolist.model.Todo;
import com.example.todolist.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TodoService {
    
    @Autowired
    private TodoRepository todoRepository;
    
    public List<Todo> getAllTodos() {
        return todoRepository.findAll();
    }
    
    public List<Todo> getTodosByCompleted(boolean completed) {
        return todoRepository.findByCompleted(completed);
    }
    
    public List<Todo> getTodosByCategory(String category) {
        return todoRepository.findByCategory(category);
    }
    
    public List<Todo> getTodosByPriority(String priority) {
        return todoRepository.findByPriority(priority);
    }
    
    public Todo saveTodo(Todo todo) {
        return todoRepository.save(todo);
    }
    
    public Optional<Todo> getTodoById(Long id) {
        return todoRepository.findById(id);
    }
    
    public void deleteTodo(Long id) {
        todoRepository.deleteById(id);
    }
    
    public Todo updateTodo(Long id, Todo todoDetails) {
        Todo todo = todoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Todo not found"));
        
        todo.setName(todoDetails.getName());
        todo.setDate(todoDetails.getDate());
        todo.setTime(todoDetails.getTime());
        todo.setCategory(todoDetails.getCategory());
        todo.setPriority(todoDetails.getPriority());
        todo.setCompleted(todoDetails.isCompleted());
        
        return todoRepository.save(todo);
    }
} 