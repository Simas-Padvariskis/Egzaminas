package com.MovieApplication.MovieApplication.mappers;

import com.MovieApplication.MovieApplication.dto.commentDTO.CommentCreateDTO;
import com.MovieApplication.MovieApplication.dto.commentDTO.CommentResponseDTO;
import com.MovieApplication.MovieApplication.entities.Comment;
import com.MovieApplication.MovieApplication.entities.Movie;

import java.time.LocalDateTime;

public class CommentMapper {
    public static Comment toEntity(CommentCreateDTO dto, Movie movie) {
        Comment comment = new Comment();
        comment.setComment(dto.getComment());
        comment.setRating(dto.getRating());
        comment.setCreatedAt(LocalDateTime.now());
        comment.setMovie(movie);
        return comment;
    }

    public static CommentResponseDTO toResponse(Comment comment) {
        CommentResponseDTO dto = new CommentResponseDTO();
        dto.setId(comment.getId());
        dto.setComment(comment.getComment());
        dto.setRating(comment.getRating());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setMovie_id(comment.getMovie().getId());
        dto.setUser_id(comment.getUser().getId());
        return dto;
    }
}