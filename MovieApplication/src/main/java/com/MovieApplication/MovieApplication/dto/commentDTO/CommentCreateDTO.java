package com.MovieApplication.MovieApplication.dto.commentDTO;

import jakarta.validation.constraints.*;

public class CommentCreateDTO {

    @NotBlank(message = "Comment cannot be empty!")
    private String comment;

    @NotNull(message = "Rating is required")
    @DecimalMin(value = "0.0", message = "IMDB rating must be at least 0.0")
    @DecimalMax(value = "10.0", message = "IMDB rating must be at most 10.0")
    private Double rating;

    @NotNull(message = "Movie ID is required")
    private Long movie_id;

    // Getters / Setters


    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Long getMovie_id() {
        return movie_id;
    }

    public void setMovie_id(Long movie_id) {
        this.movie_id = movie_id;
    }
}