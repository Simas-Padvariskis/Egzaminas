package com.MovieApplication.MovieApplication.dto.movieDTO;

import jakarta.validation.constraints.*;

public class MovieCreateDTO {

    @NotBlank(message = "Movie must have a title")
    private String title;

    private String description;

    @NotNull(message = "IMDB rating is required")
    @DecimalMin(value = "0.0", message = "IMDB rating must be at least 0.0")
    @DecimalMax(value = "10.0", message = "IMDB rating must be at most 10.0")
    private Double imdb_rating;

    @NotNull(message = "Movie must have a category ID")
    private Long category_id;

    //Getters and setters


    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getImdb_rating() {
        return imdb_rating;
    }

    public void setImdb_rating(Double imdb_rating) {
        this.imdb_rating = imdb_rating;
    }

    public Long getCategory_id() {
        return category_id;
    }

    public void setCategory_id(Long category_id) {
        this.category_id = category_id;
    }
}