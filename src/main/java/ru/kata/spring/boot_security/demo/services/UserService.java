package ru.kata.spring.boot_security.demo.services;
import ru.kata.spring.boot_security.demo.models.User;

import java.util.List;


public interface UserService {
    List<User> getAllUsers();

    User findUserById(Long id);

    User findUserByEmail(String email);

    void addUser(User user);

    void updateUser(Long id, User updatedUser);

    void deleteUser(Long id);
}
