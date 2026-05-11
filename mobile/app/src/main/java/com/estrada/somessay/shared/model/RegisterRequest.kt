package com.estrada.somessay.model

data class RegisterRequest(
    val username: String,
    val email: String,
    val password: String
)