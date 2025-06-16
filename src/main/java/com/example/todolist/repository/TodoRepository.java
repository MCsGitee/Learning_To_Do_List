package com.example.todolist.repository;

import com.example.todolist.model.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
    List<Todo> findByCompleted(boolean completed);
    List<Todo> findByCategory(String category);
    List<Todo> findByPriority(String priority);
} 