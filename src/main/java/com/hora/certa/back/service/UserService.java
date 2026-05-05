package com.hora.certa.back.service;

import com.hora.certa.back.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }
}

