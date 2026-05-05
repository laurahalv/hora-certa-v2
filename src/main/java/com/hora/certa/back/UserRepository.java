package com.hora.certa.back;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Buscar usuário por email
    User findByEmail(String email);

    // Buscar usuário por role
    java.util.List<User> findByRole(String role);

    // Verificar se existe usuário com email
    boolean existsByEmail(String email);
}

