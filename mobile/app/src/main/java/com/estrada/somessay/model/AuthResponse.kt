package com.estrada.somessay.model

data class AuthResponse(
    val status: String,
    val message: String?,
    val data: AuthData?
)

data class AuthData(
    val token: String?,
    val userId: String?,
    val username: String?,
    val role: String?
)