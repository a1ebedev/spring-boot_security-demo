package ru.kata.spring.boot_security.demo.init;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.RoleService;
import ru.kata.spring.boot_security.demo.services.UserService;

import java.util.Collections;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public DatabaseInitializer(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @Override
    public void run(String... args) {

        roleService.addRole(new Role("ROLE_ADMIN"));
        roleService.addRole(new Role("ROLE_USER"));

        userService.addUser(new User("Andrey", "Sidorov", 30, "user1@mail.ru", "123",
                Collections.singleton(roleService.findRole(1))));
        userService.addUser(new User("Maks", "Petrov", 22, "user2@mail.ru", "123",
                Collections.singleton(roleService.findRole(2))));

    }
}
