package com.MovieApplication.MovieApplication.dao;

import com.MovieApplication.MovieApplication.entities.Category;
import com.MovieApplication.MovieApplication.entities.Movie;
import com.MovieApplication.MovieApplication.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface MovieRepository extends JpaRepository<Movie, Long> {
    List<Movie> getMoviesByCategory(Category category);
    List<Movie> getMoviesByUser(User user);
    Page<Movie> findByTitleContainingIgnoreCase(String title, Pageable pageable);

}
