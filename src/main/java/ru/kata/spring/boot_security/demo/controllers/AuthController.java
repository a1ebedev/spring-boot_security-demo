package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AuthController {

    @GetMapping
    public String loginPage() {
        return "redirect:/login";
    }

    @GetMapping("/access-denied")
    public String showAccessDenied() {
        return "auth/accessDenied";
    }

}
