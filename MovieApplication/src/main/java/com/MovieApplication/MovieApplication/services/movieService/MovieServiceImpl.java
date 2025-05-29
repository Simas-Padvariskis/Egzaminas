package com.MovieApplication.MovieApplication.services.movieService;

import com.MovieApplication.MovieApplication.dao.MovieRepository;
import com.MovieApplication.MovieApplication.entities.Category;
import com.MovieApplication.MovieApplication.entities.Movie;
import com.MovieApplication.MovieApplication.entities.User;
import com.MovieApplication.MovieApplication.security.services.UserDetailsImpl;
import com.MovieApplication.MovieApplication.services.categoryService.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

@Service
public class MovieServiceImpl implements MovieService {
    private MovieRepository movieRepository;
    private CategoryService categoryService;

    @Autowired
    public MovieServiceImpl(MovieRepository movieRepository, CategoryService categoryService) {
        this.movieRepository = movieRepository;
        this.categoryService = categoryService;
    }

    @Override
    public Page<Movie> findAll(Pageable pageable) {
        return movieRepository.findAll(pageable);
    }


    @Override
    public Movie findById(Long id) {
        Optional<Movie> result = movieRepository.findById(id);

        Movie movie = null;

        if(result.isPresent()) {
            movie = result.get();
        }else{
            throw new RuntimeException("Could not find movie by id - " + id);
        }

        return movie;
    }

    @Override
    public Movie save(Movie movie) {
        return movieRepository.save(movie);
    }

    @Override
    public void deleteById(Long id) {
        movieRepository.deleteById(id);
    }

    @Override
    public List<Movie> getMoviesByCategory(Long categoryId) {
        Category category = categoryService.findById(categoryId);

        return movieRepository.getMoviesByCategory(category);
    }

    @Override
    public List<Movie> getMoviesByUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        User user = new User(userDetails.getUsername(), userDetails.getEmail(), userDetails.getPassword());
        user.setId(userDetails.getId());

        return movieRepository.getMoviesByUser(user);
    }

    public Page<Movie> findByTitleContaining(String title, Pageable pageable) {
        return movieRepository.findByTitleContainingIgnoreCase(title, pageable);
    }
}
