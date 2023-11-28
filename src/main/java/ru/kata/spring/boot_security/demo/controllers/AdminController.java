package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.RoleServiceImp;
import ru.kata.spring.boot_security.demo.services.UserService;

import java.security.Principal;


@Controller
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;

    private final RoleServiceImp roleService;

    @Autowired
    public AdminController(UserService userService, RoleServiceImp roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping
    public String listUsers(Principal principal, Model model) {

        model.addAttribute("authUser", userService.findUserByEmail(principal.getName()));
        model.addAttribute("user", new User());
        model.addAttribute("roles", roleService.getAllRoles());
        model.addAttribute("users", userService.getAllUsers());

        return "admin";
    }


    @PostMapping
    public String create(@ModelAttribute("user") User user) {

        userService.addUser(user);

        return "redirect:/admin";
    }


    @PatchMapping
    public String update(@RequestParam("id") Long id, @ModelAttribute("user") User user) {

        userService.updateUser(id, user);

        return "redirect:/admin";
    }

   @DeleteMapping
    public String remove(@RequestParam("id") Long id) {

        userService.deleteUser(id);

        return "redirect:/admin";
    }

}
