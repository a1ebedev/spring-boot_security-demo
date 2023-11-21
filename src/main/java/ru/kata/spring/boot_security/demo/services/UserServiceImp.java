package ru.kata.spring.boot_security.demo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.repositories.UserRepository;

import java.util.List;


@Service
@Transactional
public class UserServiceImp implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImp(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    @Override
    public List<User> getAllUsers() {

        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    @Override
    public User findUserById(int id) {

        return userRepository.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    @Override
    public User findUserByEmail(String email) {

        return userRepository.findByEmail(email).orElse(null);
    }

    @Override
    public void addUser(User user) {

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        userRepository.save(user);
    }

    @Override
    public void updateUser(int id, User updatedUser) {

        updatedUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        updatedUser.setId(id);

        userRepository.save(updatedUser);
    }

    @Override
    public void deleteUser(int id) {

        userRepository.deleteById(id);
    }
}
