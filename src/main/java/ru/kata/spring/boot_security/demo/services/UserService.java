package ru.kata.spring.boot_security.demo.services;



import ru.kata.spring.boot_security.demo.models.User;

import java.util.List;


public interface UserService {
    List<User> getAllUsers();

    User findUserById(int id);

    User findUserByEmail(String email);

    void addUser(User user);

    void updateUser(int id, User updatedUser);

    void deleteUser(int id);
}
