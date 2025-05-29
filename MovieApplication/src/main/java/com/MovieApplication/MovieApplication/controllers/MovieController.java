package com.MovieApplication.MovieApplication.controllers;

import com.MovieApplication.MovieApplication.config.PaginationProperties;
import com.MovieApplication.MovieApplication.dao.CategoryRepository;
import com.MovieApplication.MovieApplication.dto.movieDTO.MovieCreateDTO;
import com.MovieApplication.MovieApplication.dto.movieDTO.MovieResponseDTO;
import com.MovieApplication.MovieApplication.entities.Category;
import com.MovieApplication.MovieApplication.entities.Movie;
import com.MovieApplication.MovieApplication.entities.User;
import com.MovieApplication.MovieApplication.mappers.MovieMapper;
import com.MovieApplication.MovieApplication.security.services.UserDetailsImpl;
import com.MovieApplication.MovieApplication.services.movieService.MovieService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.*;


import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/movies")
public class MovieController {
    private MovieService movieService;
    private CategoryRepository categoryRepository;
    private PaginationProperties paginationProperties;
    private ObjectMapper objectMapper;

    @Autowired
    public MovieController(MovieService movieService, ObjectMapper objectMapper, CategoryRepository categoryRepository) {
        this.movieService = movieService;
        this.objectMapper = objectMapper;
        this.paginationProperties = new PaginationProperties();
        this.categoryRepository = categoryRepository;
    }


    // Get all paginated movies
    @GetMapping
    public ResponseEntity<Map<String, Object>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String search
    ) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Movie> moviePage;

        if (search != null && !search.isEmpty()) {
            moviePage = movieService.findByTitleContaining(search, pageable);
        } else {
            moviePage = movieService.findAll(pageable);
        }

        List<MovieResponseDTO> movies = moviePage.getContent().stream()
                .map(MovieMapper::toResponseDTO)
                .collect(Collectors.toList());

        Map<String, Object> response = Map.of(
                "status", "success",
                "results", moviePage.getTotalElements(),
                "data", movies
        );

        return ResponseEntity.ok(response);
    }

    //Return movie by id
    @GetMapping("/{movieId}")
    public ResponseEntity<MovieResponseDTO> getMovieById(@PathVariable Long movieId) {

        Optional<Movie> result = Optional.ofNullable(movieService.findById(movieId.longValue()));

        return result.map(movie -> ResponseEntity.ok(MovieMapper.toResponseDTO(movie)))
                .orElse(ResponseEntity.notFound().build());
    }

    //Return movie by category_id
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Map<String, Object>> getMoviesByCategoryId(@PathVariable Long categoryId) {
        List<MovieResponseDTO> movies;

        movies = movieService.getMoviesByCategory(categoryId)
                .stream()
                .map(MovieMapper::toResponseDTO)
                .collect(Collectors.toList());

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "success");
        response.put("results", movies.size());
        response.put("data", movies);

        return ResponseEntity.ok(response);
    }

    //Create new movie
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<MovieResponseDTO> addMovie(@Valid @RequestBody MovieCreateDTO movieCreateDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        User user = new User(userDetails.getUsername(), userDetails.getEmail(), userDetails.getPassword());
        user.setId(userDetails.getId());

        Movie movie = MovieMapper.toEntity(movieCreateDTO);

        movie.setUser(user); // Set the required User

        Category category = categoryRepository.findById(movieCreateDTO.getCategory_id())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + movieCreateDTO.getCategory_id()));

        movie.setCategory(category); // Set the required Category

        Movie saved = movieService.save(movie);

        return ResponseEntity.ok(MovieMapper.toResponseDTO(saved));
    }

    //Delete movie by id
    @DeleteMapping("/{movieId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Object>> deleteMovie(@PathVariable Long movieId) {
        Movie theMovie = movieService.findById(movieId);

        if (theMovie == null) {
            return ResponseEntity.notFound().build();
        }

        movieService.deleteById(movieId);

        // Return a proper JSON response
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "success");
        response.put("message", "Deleted movie with id - " + movieId);

        return ResponseEntity.ok(response);
    }

    //Update movie object
    @PutMapping("/{movieId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<MovieResponseDTO> updateMovie(@PathVariable Long movieId, @Valid @RequestBody MovieCreateDTO movie) {
        Movie existing = movieService.findById(movieId);

        if(existing == null){
            return ResponseEntity.notFound().build();
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        User user = new User(userDetails.getUsername(), userDetails.getEmail(), userDetails.getPassword());
        user.setId(userDetails.getId());

        Movie updatedMovie = MovieMapper.toEntity(movie);
        updatedMovie.setId(movieId);
        updatedMovie.setUser(user);  // Set current User

        Category category = categoryRepository.findById(movie.getCategory_id())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + movie.getCategory_id()));

        updatedMovie.setCategory(category);

        Movie saved = movieService.save(updatedMovie);

        return ResponseEntity.ok(MovieMapper.toResponseDTO(saved));
    }

    //Patch movie object
    @PatchMapping("/{movieId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<MovieResponseDTO> patchMovie(@PathVariable Long movieId, @RequestBody Map<String, Object> pathPayload) {
        Movie tempMovie = movieService.findById(movieId);

        if (tempMovie == null) {
            return ResponseEntity.notFound().build();
        }

        if (pathPayload.containsKey("id")) {
            return ResponseEntity.badRequest().build();
        }

        // Handle category_id
        if (pathPayload.containsKey("category_id")) {
            Object categoryIdObj = pathPayload.remove("category_id"); // Remove to avoid deserialization issues
            Long categoryId = Long.valueOf(categoryIdObj.toString());

            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));
            tempMovie.setCategory(category);
        }

        ObjectNode movieNode = objectMapper.convertValue(tempMovie, ObjectNode.class);
        ObjectNode pathNode = objectMapper.convertValue(pathPayload, ObjectNode.class);
        movieNode.setAll(pathNode);

        Movie patchedMovie = objectMapper.convertValue(movieNode, Movie.class);

        if (tempMovie.getCategory() != null) {
            patchedMovie.setCategory(tempMovie.getCategory());
        }

        Movie savedMovie = movieService.save(patchedMovie);
        return ResponseEntity.ok(MovieMapper.toResponseDTO(savedMovie));
    }

    //Return all movies created by User
    @GetMapping("/user")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Object>> findMoviesByUser(){
        List<MovieResponseDTO> movies;

        movies = movieService.getMoviesByUser()
                .stream()
                .map(MovieMapper::toResponseDTO)
                .collect(Collectors.toList());

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "success");
        response.put("results", movies.size());
        response.put("data", movies);

        return ResponseEntity.ok(response);
    }
}