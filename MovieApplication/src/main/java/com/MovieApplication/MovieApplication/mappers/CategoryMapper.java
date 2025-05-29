package com.MovieApplication.MovieApplication.mappers;

import com.MovieApplication.MovieApplication.dto.categoryDTO.CategoryCreateDTO;
import com.MovieApplication.MovieApplication.dto.categoryDTO.CategoryResponseDTO;
import com.MovieApplication.MovieApplication.entities.Category;

import java.time.LocalDateTime;

public class CategoryMapper {
    public static Category toEntity(CategoryCreateDTO dto) {
        Category category = new Category();
        category.setTitle(dto.getTitle());
        category.setCreated_at(LocalDateTime.now());
        return category;
    }

    public static CategoryResponseDTO toResponseDTO(Category entity) {
        CategoryResponseDTO dto = new CategoryResponseDTO();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setUser_id(entity.getUser().getId());
        dto.setCreated_at(entity.getCreated_at());
        return dto;
    }
}