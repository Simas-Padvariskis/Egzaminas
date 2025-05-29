package com.MovieApplication.MovieApplication.services.userService;

import com.MovieApplication.MovieApplication.dao.UserRepository;
import com.MovieApplication.MovieApplication.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public User findById(Long userId) {
        Optional<User> result = userRepository.findById(userId);

        if(result.isPresent()) {
            return result.get();
        } else {
            throw new RuntimeException("Could not find user by id - " + userId);
        }
    }

    @Override
    public User save(User user) {
        return userRepository.save(user);
    }

    @Override
    public void deleteById(Long userId) {
        userRepository.deleteById(userId);
    }
}