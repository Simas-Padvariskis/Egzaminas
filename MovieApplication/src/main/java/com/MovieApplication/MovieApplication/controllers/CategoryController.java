package com.MovieApplication.MovieApplication.controllers;

import com.MovieApplication.MovieApplication.dao.CategoryRepository;
import com.MovieApplication.MovieApplication.dto.MessageResponse;
import com.MovieApplication.MovieApplication.dto.categoryDTO.CategoryCreateDTO;
import com.MovieApplication.MovieApplication.dto.categoryDTO.CategoryResponseDTO;
import com.MovieApplication.MovieApplication.entities.Category;
import com.MovieApplication.MovieApplication.entities.User;
import com.MovieApplication.MovieApplication.mappers.CategoryMapper;
import com.MovieApplication.MovieApplication.security.services.UserDetailsImpl;
import com.MovieApplication.MovieApplication.services.categoryService.CategoryService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/categories")
public class CategoryController {

    private final CategoryRepository categoryRepository;
    private CategoryService categoryService;

    private ObjectMapper objectMapper;

    @Autowired
    public CategoryController(CategoryService categoryService, ObjectMapper objectMapper, CategoryRepository categoryRepository) {
        this.categoryService = categoryService;
        this.objectMapper = objectMapper;
        this.categoryRepository = categoryRepository;
    }

    //Return all categories
    @GetMapping
    public ResponseEntity<Map<String, Object>> findAll(){
        List<CategoryResponseDTO> categories;

        categories = categoryService.findAll()
                .stream()
                .map(CategoryMapper::toResponseDTO)
                .collect(Collectors.toList());

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "success");
        response.put("results", categories.size());
        response.put("data", categories);

        return ResponseEntity.ok(response);
    }

    //Return category by id
    @GetMapping("/{categoryId}")
    public ResponseEntity<CategoryResponseDTO> getCategoryById(@PathVariable Long categoryId) {

        Optional<Category> result = Optional.ofNullable(categoryService.findById(categoryId.longValue()));

        return result.map(category -> ResponseEntity.ok(CategoryMapper.toResponseDTO(category)))
                .orElse(ResponseEntity.notFound().build());
    }

    //Create new category
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> addCategory(@Valid @RequestBody CategoryCreateDTO categoryCreateDTO) {
        if(categoryRepository.existsByTitle(categoryCreateDTO.getTitle())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Category already exists."));
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        User user = new User(userDetails.getUsername(), userDetails.getEmail(), userDetails.getPassword());
        user.setId(userDetails.getId());

        Category category = CategoryMapper.toEntity(categoryCreateDTO);
        category.setUser(user); // Set required user
        Category saved = categoryService.save(category);

        return ResponseEntity.ok(CategoryMapper.toResponseDTO(saved));
    }

    //Delete category by id
    @DeleteMapping("/{categoryId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Object>> deleteCategory(@PathVariable Long categoryId) {
        Category theCategory = categoryService.findById(categoryId);

        if (theCategory == null) {
            return ResponseEntity.notFound().build();
        }

        categoryService.deleteById(categoryId);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "success");
        response.put("message", "Deleted category with id - " + categoryId);

        return ResponseEntity.ok(response);
    }

    //Update category object
    @PutMapping("/{categoryId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<CategoryResponseDTO> updateCategory(@PathVariable Long categoryId, @Valid @RequestBody CategoryCreateDTO category) {
        Category existing = categoryService.findById(categoryId);

        if(existing == null){
            return ResponseEntity.notFound().build();
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        User user = new User(userDetails.getUsername(), userDetails.getEmail(), userDetails.getPassword());
        user.setId(userDetails.getId());

        Category updatedCategory = CategoryMapper.toEntity(category);
        updatedCategory.setId(categoryId);
        updatedCategory.setUser(user);  // Set current User

        Category saved = categoryService.save(updatedCategory);

        return ResponseEntity.ok(CategoryMapper.toResponseDTO(saved));
    }
}