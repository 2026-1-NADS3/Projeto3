package com.maya.rpg.ui.splash;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.view.animation.AlphaAnimation;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import com.maya.rpg.R;
import com.maya.rpg.api.TokenManager;
import com.maya.rpg.ui.auth.ChangePasswordActivity;
import com.maya.rpg.ui.auth.LgpdConsentActivity;
import com.maya.rpg.ui.auth.LoginActivity;
import com.maya.rpg.ui.home.HomeActivity;

public class SplashActivity extends AppCompatActivity {

    private static final int SPLASH_DURATION = 3000; // 3 seconds

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);

        ImageView ivSplashLogo = findViewById(R.id.ivSplashLogo);
        TextView tvSplashWelcome = findViewById(R.id.tvSplashWelcome);

        // Simple Fade In Animation
        AlphaAnimation fadeIn = new AlphaAnimation(0.0f, 1.0f);
        fadeIn.setDuration(1500);
        fadeIn.setFillAfter(true);

        ivSplashLogo.startAnimation(fadeIn);
        tvSplashWelcome.startAnimation(fadeIn);

        // Automatic navigation after 3 seconds
        new Handler().postDelayed(() -> {
            startActivity(resolveNextScreen());
            finish();
        }, SPLASH_DURATION);
    }

    private Intent resolveNextScreen() {
        if (!TokenManager.isLoggedIn()) {
            return new Intent(this, LoginActivity.class);
        }

        if (TokenManager.isFirstAccess()) {
            return new Intent(this, ChangePasswordActivity.class);
        }

        if (!TokenManager.hasAcceptedLgpd()) {
            return new Intent(this, LgpdConsentActivity.class);
        }

        return new Intent(this, HomeActivity.class);
    }
}
