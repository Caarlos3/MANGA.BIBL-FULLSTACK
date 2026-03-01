package com.caarlos.mangalibrary.auth;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.caarlos.mangalibrary.auth.dto.LoginRequest;
import com.caarlos.mangalibrary.auth.dto.RegisterRequest;
import com.caarlos.mangalibrary.model.Role;
import com.caarlos.mangalibrary.model.User;
import com.caarlos.mangalibrary.repository.UserRepository;
import com.caarlos.mangalibrary.security.JwtService;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder encoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public String register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email)) {
            throw new IllegalArgumentException("El email ya está registrado");
        }

        User user = new User(
                request.email,
                encoder.encode(request.password),
                request.username,
                Role.USER
        );

        userRepository.save(user);
        return jwtService.generateToken(user.getEmail(), user.getRole().name());
    }

    public String login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        if (!encoder.matches(request.password, user.getPassword())) {
            throw new IllegalArgumentException("Contraseña incorrecta");
        }

        return jwtService.generateToken(user.getEmail(), user.getRole().name());
    }
}