package com.maya.rpg.ui.splash;

import android.content.Intent;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import com.maya.rpg.R;
import com.maya.rpg.api.TokenManager;
import com.maya.rpg.ui.auth.LoginActivity;
import com.maya.rpg.ui.home.HomeActivity;

public class SplashActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        TokenManager.init(this);
        setContentView(R.layout.activity_splash);

        findViewById(R.id.btnNext).setOnClickListener(v -> {
            Intent intent;
            if (TokenManager.isLoggedIn()) {
                intent = new Intent(this, HomeActivity.class);
            } else {
                intent = new Intent(this, LoginActivity.class);
            }
            startActivity(intent);
            finish();
        });
    }
}