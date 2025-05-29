package com.MovieApplication.MovieApplication.services.userService;

import com.MovieApplication.MovieApplication.entities.User;

import java.util.List;

public interface UserService {
    List<User> findAll();
    User findById(Long userId);
    User save(User user);
    void deleteById(Long userId);
}
