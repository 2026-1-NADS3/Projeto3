package com.maya.rpg.ui.home;

import android.content.Intent;
import android.os.Bundle;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import com.maya.rpg.R;
import com.maya.rpg.api.TokenManager;
import com.maya.rpg.ui.exercises.ExercisePlanActivity;

public class HomeActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        // Mostra nome do usuário
        String userName = TokenManager.getUserName();
        if (userName != null) {
            TextView tvUserName = findViewById(R.id.tvUserName);
            tvUserName.setText("Olá, " + userName.split(" ")[0]);
        }

        // Card e nav de plano de exercícios
        findViewById(R.id.cardExercises).setOnClickListener(v ->
                startActivity(new Intent(this, ExercisePlanActivity.class))
        );

        findViewById(R.id.navExercises).setOnClickListener(v ->
                startActivity(new Intent(this, ExercisePlanActivity.class))
        );

        // Card evolução — por enquanto vai para exercícios também
        findViewById(R.id.cardEvolution).setOnClickListener(v ->
                startActivity(new Intent(this, ExercisePlanActivity.class))
        );

        findViewById(R.id.navEvolution).setOnClickListener(v ->
                startActivity(new Intent(this, ExercisePlanActivity.class))
        );

        // Home nav não faz nada (já está na home)
        findViewById(R.id.navHome).setOnClickListener(v -> {});
    }
}