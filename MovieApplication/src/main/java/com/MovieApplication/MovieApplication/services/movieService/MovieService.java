package com.MovieApplication.MovieApplication.services.movieService;

import com.MovieApplication.MovieApplication.entities.Movie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface MovieService {
    //    List<Movie> findAll();
    Page<Movie> findAll(Pageable pageable);

    Page<Movie> findByTitleContaining(String title, Pageable pageable);

    Movie findById(Long id);

    Movie save(Movie movie);

    void deleteById(Long id);

    List<Movie> getMoviesByCategory(Long categoryId);

    List<Movie> getMoviesByUser();
}