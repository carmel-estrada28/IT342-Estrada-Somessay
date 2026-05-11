package com.estrada.somessay.shared.model

data class AuthResponse(
    val status: String,
    val message: String?,
    val data: AuthData?
)

data class AuthData(
    val token: String?,
    val userId: Int?,
    val username: String?,
    val role: String?,
    val email: String?
)