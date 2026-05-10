package com.maya.rpg.ui.auth;

import android.os.Bundle;
import android.text.TextUtils;
import android.util.Patterns;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.maya.rpg.R;
import com.maya.rpg.api.RetrofitClient;
import com.maya.rpg.model.RecoverPasswordResponse;
import com.maya.rpg.model.ResetPasswordRequest;

import java.util.Collections;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class RecoverPasswordActivity extends AppCompatActivity {

    private EditText etEmail;
    private EditText etToken;
    private EditText etNovaSenha;
    private Button btnEnviar;
    private Button btnRedefinir;
    private TextView tvDevToken;
    private TextView tvVoltarLogin;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_recover_password);

        etEmail = findViewById(R.id.etEmail);
        etToken = findViewById(R.id.etToken);
        etNovaSenha = findViewById(R.id.etNovaSenha);
        btnEnviar = findViewById(R.id.btnEnviar);
        btnRedefinir = findViewById(R.id.btnRedefinir);
        tvDevToken = findViewById(R.id.tvDevToken);
        tvVoltarLogin = findViewById(R.id.tvVoltarLogin);
        tvVoltarLogin.setPaintFlags(
                tvVoltarLogin.getPaintFlags() | android.graphics.Paint.UNDERLINE_TEXT_FLAG
        );

        btnEnviar.setOnClickListener(v -> requestToken());
        btnRedefinir.setOnClickListener(v -> resetPassword());
        tvVoltarLogin.setOnClickListener(v -> finish());
    }

    private void requestToken() {
        String email = etEmail.getText().toString().trim();

        if (TextUtils.isEmpty(email)) {
            etEmail.setError("Informe seu e-mail");
            etEmail.requestFocus();
            return;
        }

        if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            etEmail.setError("E-mail inválido");
            etEmail.requestFocus();
            return;
        }

        btnEnviar.setEnabled(false);
        btnEnviar.setText("Enviando...");
        tvDevToken.setVisibility(View.GONE);

        Map<String, String> body = Collections.singletonMap("email", email);
        RetrofitClient.getApiService().recoverPassword(body).enqueue(new Callback<RecoverPasswordResponse>() {
            @Override
            public void onResponse(Call<RecoverPasswordResponse> call,
                                   Response<RecoverPasswordResponse> response) {
                btnEnviar.setEnabled(true);
                btnEnviar.setText("Enviar token");
                Toast.makeText(RecoverPasswordActivity.this,
                        "Se o e-mail existir, você receberá um token em instantes.",
                        Toast.LENGTH_LONG).show();

                if (response.isSuccessful() && response.body() != null
                        && response.body().getDevToken() != null) {
                    String dev = response.body().getDevToken();
                    tvDevToken.setVisibility(View.VISIBLE);
                    tvDevToken.setText("(DEV) Token: " + dev);
                    etToken.setText(dev);
                }
            }

            @Override
            public void onFailure(Call<RecoverPasswordResponse> call, Throwable t) {
                btnEnviar.setEnabled(true);
                btnEnviar.setText("Enviar token");
                Toast.makeText(RecoverPasswordActivity.this,
                        "Falha de conexão. Tente novamente.",
                        Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void resetPassword() {
        String token = etToken.getText().toString().trim();
        String novaSenha = etNovaSenha.getText().toString();

        if (TextUtils.isEmpty(token)) {
            etToken.setError("Informe o token recebido");
            etToken.requestFocus();
            return;
        }

        if (novaSenha.length() < 6) {
            etNovaSenha.setError("Senha deve ter no mínimo 6 caracteres");
            etNovaSenha.requestFocus();
            return;
        }

        btnRedefinir.setEnabled(false);
        btnRedefinir.setText("Salvando...");

        ResetPasswordRequest req = new ResetPasswordRequest(token, novaSenha);
        RetrofitClient.getApiService().resetPassword(req).enqueue(new Callback<Map<String, String>>() {
            @Override
            public void onResponse(Call<Map<String, String>> call,
                                   Response<Map<String, String>> response) {
                btnRedefinir.setEnabled(true);
                btnRedefinir.setText("Redefinir senha");
                if (response.isSuccessful()) {
                    Toast.makeText(RecoverPasswordActivity.this,
                            "Senha redefinida com sucesso. Faça login novamente.",
                            Toast.LENGTH_LONG).show();
                    finish();
                } else {
                    Toast.makeText(RecoverPasswordActivity.this,
                            "Token inválido ou expirado.",
                            Toast.LENGTH_LONG).show();
                }
            }

            @Override
            public void onFailure(Call<Map<String, String>> call, Throwable t) {
                btnRedefinir.setEnabled(true);
                btnRedefinir.setText("Redefinir senha");
                Toast.makeText(RecoverPasswordActivity.this,
                        "Falha de conexão. Tente novamente.",
                        Toast.LENGTH_SHORT).show();
            }
        });
    }
}
