package com.maya.rpg.ui.profile;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.material.bottomsheet.BottomSheetDialog;
import com.maya.rpg.R;
import com.maya.rpg.api.RetrofitClient;
import com.maya.rpg.api.TokenManager;
import com.maya.rpg.model.Patient;
import com.maya.rpg.ui.BaseAuthActivity;
import com.maya.rpg.ui.evolution.EvolutionActivity;
import com.maya.rpg.ui.home.HomeActivity;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class EditProfileActivity extends BaseAuthActivity {

    private TextView tvProfileName, tvEmail, tvDisplayFullName, tvDisplayBirthDate;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_edit_profile);

        tvProfileName = findViewById(R.id.tvProfileName);
        tvEmail = findViewById(R.id.tvEmail);
        tvDisplayFullName = findViewById(R.id.tvDisplayFullName);
        tvDisplayBirthDate = findViewById(R.id.tvDisplayBirthDate);

        findViewById(R.id.btnBack).setOnClickListener(v -> finish());
        findViewById(R.id.btnLogout).setOnClickListener(v -> showLogoutConfirmation());

        // Interaction logic
        findViewById(R.id.tvActionEditName).setOnClickListener(v -> {
            Toast.makeText(this, "Funcionalidade de edição em breve", Toast.LENGTH_SHORT).show();
        });

        View.OnClickListener comingSoon = v -> Toast.makeText(this, "Funcionalidade em breve", Toast.LENGTH_SHORT).show();
        findViewById(R.id.rowEditName).setOnClickListener(comingSoon);
        findViewById(R.id.rowEditBirthDate).setOnClickListener(comingSoon);
        findViewById(R.id.rowEmailDisplay).setOnClickListener(comingSoon);
        findViewById(R.id.rowEditPhoto).setOnClickListener(comingSoon);
        findViewById(R.id.rowNotifications).setOnClickListener(comingSoon);
        findViewById(R.id.rowLanguage).setOnClickListener(comingSoon);
        findViewById(R.id.rowTheme).setOnClickListener(comingSoon);

        loadProfile();
        setupBottomNav();
    }

    private void loadProfile() {
        RetrofitClient.getApiService().getMyPatient().enqueue(new Callback<Patient>() {
            @Override
            public void onResponse(Call<Patient> call, Response<Patient> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Patient p = response.body();
                    tvProfileName.setText(p.getName());
                    tvEmail.setText(p.getEmail());
                    tvDisplayFullName.setText(p.getFullName() != null ? p.getFullName() : p.getName());
                    tvDisplayBirthDate.setText(p.getBirthDate() != null ? p.getBirthDate() : "Não informado");
                }
            }

            @Override
            public void onFailure(Call<Patient> call, Throwable t) {
                Toast.makeText(EditProfileActivity.this, "Erro ao carregar dados", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void showLogoutConfirmation() {
        BottomSheetDialog dialog = new BottomSheetDialog(this);
        View view = getLayoutInflater().inflate(R.layout.dialog_logout_confirmation, null);
        
        view.findViewById(R.id.btnCancelLogout).setOnClickListener(v -> dialog.dismiss());
        view.findViewById(R.id.btnConfirmLogout).setOnClickListener(v -> {
            dialog.dismiss();
            performLogout();
        });

        dialog.setContentView(view);
        dialog.show();
    }

    private void performLogout() {
        TokenManager.clearAll();
        Intent intent = new Intent(this, com.maya.rpg.ui.auth.LoginActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        finish();
    }

    private void setupBottomNav() {
        findViewById(R.id.navHome).setOnClickListener(v -> startActivity(new Intent(this, HomeActivity.class)));
        findViewById(R.id.navExercises).setOnClickListener(v -> startActivity(new Intent(this, com.maya.rpg.ui.exercises.ExercisePlanActivity.class)));
        findViewById(R.id.navEvolution).setOnClickListener(v -> startActivity(new Intent(this, EvolutionActivity.class)));
        findViewById(R.id.navMore).setOnClickListener(v -> {
            startActivity(new Intent(this, ProfileActivity.class));
            finish();
        });
    }
}
