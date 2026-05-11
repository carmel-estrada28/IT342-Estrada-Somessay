package com.estrada.somessay.shared.api

import com.estrada.somessay.shared.model.AuthResponse
import com.estrada.somessay.shared.model.LoginRequest
import com.estrada.somessay.shared.model.RegisterRequest
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface ApiService {
    @POST("auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<AuthResponse>

    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>
}