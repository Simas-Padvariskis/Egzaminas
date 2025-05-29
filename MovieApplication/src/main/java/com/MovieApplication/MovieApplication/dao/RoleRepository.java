package com.MovieApplication.MovieApplication.dao;

import com.MovieApplication.MovieApplication.entities.Role;
import com.MovieApplication.MovieApplication.enums.Roles;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(Roles name);
}
