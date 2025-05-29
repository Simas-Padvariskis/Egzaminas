package com.MovieApplication.MovieApplication.mappers;

import com.MovieApplication.MovieApplication.dto.userDTO.UserResponseDTO;
import com.MovieApplication.MovieApplication.entities.User;

import java.util.stream.Collectors;

public class UserMapper {
    public static UserResponseDTO toResponse(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());

        // Convert roles to string names
        if (user.getRoles() != null) {
            dto.setRoles(user.getRoles().stream()
                    .map(role -> role.getName().toString())
                    .collect(Collectors.toSet()));
        }

        return dto;
    }
}