package com.maya.rpg.ui.auth;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.maya.rpg.R;
import com.maya.rpg.api.RetrofitClient;
import com.maya.rpg.api.TokenManager;
import com.maya.rpg.model.LoginRequest;
import com.maya.rpg.model.LoginResponse;
import com.maya.rpg.model.Patient;
import com.maya.rpg.ui.home.HomeActivity;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LoginActivity extends AppCompatActivity {

    private EditText etEmail, etPassword;
    private Button btnLogin;
    private TextView tvForgotPassword;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        etEmail = findViewById(R.id.etEmail);
        etPassword = findViewById(R.id.etPassword);
        btnLogin = findViewById(R.id.btnLogin);
        tvForgotPassword = findViewById(R.id.tvForgotPassword);

        btnLogin.setOnClickListener(v -> doLogin());
        tvForgotPassword.setOnClickListener(v ->
                Toast.makeText(this, "Em breve", Toast.LENGTH_SHORT).show()
        );
    }

    private void doLogin() {
        String email = etEmail.getText().toString().trim();
        String password = etPassword.getText().toString().trim();

        if (email.isEmpty() || password.isEmpty()) {
            Toast.makeText(this, "Preencha todos os campos", Toast.LENGTH_SHORT).show();
            return;
        }

        btnLogin.setEnabled(false);
        btnLogin.setText("Entrando...");

        RetrofitClient.getApiService().login(new LoginRequest(email, password))
                .enqueue(new Callback<LoginResponse>() {
                    @Override
                    public void onResponse(Call<LoginResponse> call, Response<LoginResponse> response) {
                        btnLogin.setEnabled(true);
                        btnLogin.setText("ENTRAR");

                        if (response.isSuccessful() && response.body() != null) {
                            TokenManager.saveToken(response.body().getAccessToken());

                            if (response.body().getUser() != null) {
                                TokenManager.saveUserName(response.body().getUser().getName());
                            }

                            RetrofitClient.reset();
                            fetchMyPatient();
                        } else {
                            Toast.makeText(LoginActivity.this, "Email ou senha incorretos", Toast.LENGTH_SHORT).show();
                        }
                    }

                    @Override
                    public void onFailure(Call<LoginResponse> call, Throwable t) {
                        btnLogin.setEnabled(true);
                        btnLogin.setText("ENTRAR");
                        Toast.makeText(LoginActivity.this, "Erro de conexão", Toast.LENGTH_SHORT).show();
                    }
                });
    }

    private void fetchMyPatient() {
        RetrofitClient.getApiService().getMyPatient()
                .enqueue(new Callback<Patient>() {
                    @Override
                    public void onResponse(Call<Patient> call, Response<Patient> response) {
                        if (response.isSuccessful() && response.body() != null) {
                            TokenManager.savePatientId(response.body().getId());
                        }
                        goToHome();
                    }

                    @Override
                    public void onFailure(Call<Patient> call, Throwable t) {
                        goToHome();
                    }
                });
    }

    private void goToHome() {
        startActivity(new Intent(LoginActivity.this, HomeActivity.class));
        finish();
    }
}