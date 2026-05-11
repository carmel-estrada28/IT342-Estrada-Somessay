package com.estrada.somessay.ui.auth

import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.estrada.somessay.api.RetrofitClient
import com.estrada.somessay.databinding.ActivityLoginBinding
import com.estrada.somessay.model.LoginRequest
import com.estrada.somessay.utils.TokenManager
import com.estrada.somessay.ui.home.HomeActivity
import kotlinx.coroutines.launch

class LoginActivity : AppCompatActivity() {

    private lateinit var binding: ActivityLoginBinding
    private lateinit var tokenManager: TokenManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        tokenManager = TokenManager(this)

        if (tokenManager.isLoggedIn()) {
            goToHome()
            return
        }

        binding.btnLogin.setOnClickListener {
            val email = binding.etEmail.text.toString().trim()
            val password = binding.etPassword.text.toString()

            if (email.isEmpty() || password.isEmpty()) {
                showError("Email and password are required.")
                return@setOnClickListener
            }

            loginUser(email, password)
        }

        binding.tvGoToRegister.setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
        }
    }

    private fun loginUser(email: String, password: String) {
        binding.btnLogin.isEnabled = false
        binding.tvError.visibility = View.GONE

        lifecycleScope.launch {
            try {
                val response = RetrofitClient.instance.login(
                    LoginRequest(email, password)
                )
                if (response.isSuccessful && response.body() != null) {
                    val body = response.body()!!
                    val token = body.data?.token
                    val username = body.data?.username

                    if (token != null) {
                        tokenManager.saveToken(token)
                        tokenManager.saveUsername(username ?: "")
                        goToHome()
                    } else {
                        showError("Login failed. Please try again.")
                    }
                } else {
                    showError("Incorrect email or password.")
                }
            } catch (e: Exception) {
                showError("Network error: ${e.message}")
            } finally {
                binding.btnLogin.isEnabled = true
            }
        }
    }

    private fun showError(msg: String) {
        binding.tvError.text = msg
        binding.tvError.visibility = View.VISIBLE
    }

    private fun goToHome() {
        startActivity(Intent(this, HomeActivity::class.java))
        finish()
    }
}