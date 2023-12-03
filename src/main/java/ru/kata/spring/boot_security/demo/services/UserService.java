package ru.kata.spring.boot_security.demo.services;
import ru.kata.spring.boot_security.demo.models.User;

import java.util.List;


public interface UserService {
    List<User> getAllUsers();

    User findUserByEmail(String email);

    User findUserById(Long id);

    void addUser(User user);

    void updateUser(Long id, User updatedUser);

    void deleteUser(Long id);
}
