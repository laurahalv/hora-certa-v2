package com.hora.certa.back.util;

import java.security.SecureRandom;
import java.util.Random;

public class PasswordGenerator {
    private static final String UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
    private static final String DIGITS = "0123456789";
    private static final String SPECIAL_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    private static final String ALL_CHARS = UPPERCASE + LOWERCASE + DIGITS + SPECIAL_CHARS;
    private static final Random RANDOM = new SecureRandom();

    /**
     * Gera uma senha aleatória com 12 caracteres
     * Inclui: letras maiúsculas, minúsculas, números e caracteres especiais
     */
    public static String generatePassword() {
        return generatePassword(12);
    }

    /**
     * Gera uma senha aleatória com tamanho especificado
     * Inclui: letras maiúsculas, minúsculas, números e caracteres especiais
     */
    public static String generatePassword(int length) {
        if (length < 4) {
            throw new IllegalArgumentException("Tamanho mínimo de senha é 4 caracteres");
        }

        StringBuilder password = new StringBuilder(length);

        // Garante pelo menos um de cada tipo
        password.append(UPPERCASE.charAt(RANDOM.nextInt(UPPERCASE.length())));
        password.append(LOWERCASE.charAt(RANDOM.nextInt(LOWERCASE.length())));
        password.append(DIGITS.charAt(RANDOM.nextInt(DIGITS.length())));
        password.append(SPECIAL_CHARS.charAt(RANDOM.nextInt(SPECIAL_CHARS.length())));

        // Completa o restante com caracteres aleatórios
        for (int i = 4; i < length; i++) {
            password.append(ALL_CHARS.charAt(RANDOM.nextInt(ALL_CHARS.length())));
        }

        // Embaralha a senha
        return shuffleString(password.toString());
    }

    /**
     * Gera uma senha aleatória simples (apenas letras e números)
     */
    public static String generateSimplePassword() {
        return generateSimplePassword(12);
    }

    /**
     * Gera uma senha aleatória simples com tamanho especificado
     */
    public static String generateSimplePassword(int length) {
        String chars = UPPERCASE + LOWERCASE + DIGITS;
        StringBuilder password = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            password.append(chars.charAt(RANDOM.nextInt(chars.length())));
        }
        return password.toString();
    }

    private static String shuffleString(String input) {
        char[] chars = input.toCharArray();
        for (int i = chars.length - 1; i > 0; i--) {
            int randomIndex = RANDOM.nextInt(i + 1);
            char temp = chars[i];
            chars[i] = chars[randomIndex];
            chars[randomIndex] = temp;
        }
        return new String(chars);
    }
}

