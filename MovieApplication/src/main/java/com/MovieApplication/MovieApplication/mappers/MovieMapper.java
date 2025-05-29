package com.MovieApplication.MovieApplication.mappers;

import com.MovieApplication.MovieApplication.dto.movieDTO.MovieCreateDTO;
import com.MovieApplication.MovieApplication.dto.movieDTO.MovieResponseDTO;
import com.MovieApplication.MovieApplication.entities.Movie;

import java.time.LocalDateTime;

public class MovieMapper {
    public static Movie toEntity(MovieCreateDTO dto) {
        Movie movie = new Movie();
        movie.setTitle(dto.getTitle());
        movie.setDescription(dto.getDescription());
        movie.setImdb_rating(dto.getImdb_rating());
        movie.setCreated_at(LocalDateTime.now());
        movie.setUpdated_at(LocalDateTime.now());
        return movie;
    }

    public static MovieResponseDTO toResponseDTO(Movie entity) {
        MovieResponseDTO dto = new MovieResponseDTO();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        dto.setImdb_rating(entity.getImdb_rating());
        dto.setCategory(entity.getCategory().getTitle());
        dto.setUser_id(entity.getUser().getId());
        dto.setCreated_at(entity.getCreated_at());
        dto.setUpdated_at(entity.getUpdated_at());
        return dto;
    }
}