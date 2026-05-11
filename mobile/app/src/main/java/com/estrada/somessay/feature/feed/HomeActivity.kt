package com.estrada.somessay.feature.feed

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.estrada.somessay.databinding.ActivityHomeBinding
import com.estrada.somessay.shared.utils.TokenManager
import com.estrada.somessay.feature.auth.LoginActivity

class HomeActivity : AppCompatActivity() {

    private lateinit var binding: ActivityHomeBinding
    private lateinit var tokenManager: TokenManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityHomeBinding.inflate(layoutInflater)
        setContentView(binding.root)

        tokenManager = TokenManager(this)

        val username = tokenManager.getUsername()
        binding.tvWelcome.text = "welcome back, $username ·˚"

        binding.tvLogout.setOnClickListener {
            tokenManager.clearAll()
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
        }
    }
}