package com.MovieApplication.MovieApplication.services.commentService;

import com.MovieApplication.MovieApplication.entities.Comment;

import java.util.List;

public interface CommentService {
    List<Comment> findAll();
    List<Comment> findByMovieId(Long movieId);
    Comment save(Comment comment);
    Comment findById(Long commentId);
    void deleteById(Long commentId);
}
