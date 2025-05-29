package com.MovieApplication.MovieApplication.services.commentService;

import com.MovieApplication.MovieApplication.dao.CommentRepository;
import com.MovieApplication.MovieApplication.entities.Comment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CommentServiceImpl implements CommentService {
    private final CommentRepository commentRepository;

    @Autowired
    public CommentServiceImpl(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    @Override
    public List<Comment> findAll() {
        return commentRepository.findAll();
    }

    @Override
    public List<Comment> findByMovieId(Long movieId) {
        return commentRepository.findByMovieId(movieId);
    }

    @Override
    public Comment save(Comment comment) {
        return commentRepository.save(comment);
    }

    @Override
    public Comment findById(Long commentId) {
        Optional<Comment> result = commentRepository.findById(commentId);

        Comment comment = null;

        if(result.isPresent()) {
            comment = result.get();
        }else{
            throw new RuntimeException("Could not find comment by id - " + commentId);
        }

        return comment;
    }

    @Override
    public void deleteById(Long commentId) {
        commentRepository.deleteById(commentId);
    }
}