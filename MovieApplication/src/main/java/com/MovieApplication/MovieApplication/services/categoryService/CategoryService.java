package com.MovieApplication.MovieApplication.services.categoryService;

import com.MovieApplication.MovieApplication.entities.Category;

import java.util.List;

public interface CategoryService {
    List<Category> findAll();

    Category findById(Long id);

    Category save(Category category);

    void deleteById(Long id);
}