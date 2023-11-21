package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.RoleServiceImp;
import ru.kata.spring.boot_security.demo.services.UserService;


@Controller
@RequestMapping("/admin")
public class AdminController {
    private final UserService userService;
    private final RoleServiceImp roleService;

    @Autowired
    public AdminController(UserService userService, RoleServiceImp roleServiceImp) {
        this.userService = userService;
        this.roleService = roleServiceImp;
    }

    @GetMapping
    public String listUsers(Model model) {

        model.addAttribute("users", userService.getAllUsers());

        return "users/index";
    }

    @GetMapping(value = "/new")
    public String addUser(Model model) {

        model.addAttribute("user", new User());
        model.addAttribute("roles", roleService.getAllRoles());

        return "users/new";
    }

    @PostMapping
    public String create(@ModelAttribute("user") User user) {

        userService.addUser(user);

        return "redirect:/admin";
    }

    @GetMapping(value = "/edit")
    public String editUser(@RequestParam("id") int id, Model model) {

        model.addAttribute("user", userService.findUserById(id));
        model.addAttribute("roles", roleService.getAllRoles());

        return "users/edit";
    }

    @PostMapping(value = "/edit")
    public String update(@RequestParam("id") int id, @ModelAttribute("user") User user) {

        userService.updateUser(id, user);

        return "redirect:/admin";
    }

    @PostMapping("/remove")
    public String remove(@RequestParam("id") int id) {

        userService.deleteUser(id);

        return "redirect:/admin";
    }

}
