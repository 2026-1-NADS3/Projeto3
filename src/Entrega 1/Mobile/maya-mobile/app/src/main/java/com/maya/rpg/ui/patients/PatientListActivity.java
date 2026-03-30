package com.maya.rpg.ui.patients;

import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.maya.rpg.R;
import com.maya.rpg.api.RetrofitClient;
import com.maya.rpg.model.Patient;
import com.maya.rpg.model.PaginatedResponse;
import java.util.ArrayList;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class PatientListActivity extends AppCompatActivity {

    private RecyclerView rvPatients;
    private ProgressBar progressBar;
    private EditText etSearch;
    private PatientAdapter adapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_patient_list);

        rvPatients = findViewById(R.id.rvPatients);
        progressBar = findViewById(R.id.progressBar);
        etSearch = findViewById(R.id.etSearch);

        adapter = new PatientAdapter(new ArrayList<>(), patient -> {
            Intent intent = new Intent(this, PatientDetailActivity.class);
            intent.putExtra("patient_id", patient.getId());
            intent.putExtra("patient_name", patient.getFullName());
            intent.putExtra("patient_email", patient.getEmail());
            intent.putExtra("patient_phone", patient.getPhone());
            intent.putExtra("patient_cpf", patient.getCpf());
            intent.putExtra("patient_status", patient.getStatus());
            intent.putExtra("patient_notes", patient.getNotes());
            startActivity(intent);
        });

        rvPatients.setLayoutManager(new LinearLayoutManager(this));
        rvPatients.setAdapter(adapter);

        findViewById(R.id.btnBack).setOnClickListener(v -> finish());

        etSearch.addTextChangedListener(new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override public void afterTextChanged(Editable s) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                loadPatients(s.toString());
            }
        });

        loadPatients("");
    }

    private void loadPatients(String search) {
        progressBar.setVisibility(View.VISIBLE);

        RetrofitClient.getApiService()
                .getPatients(1, 50, search.isEmpty() ? null : search)
                .enqueue(new Callback<PaginatedResponse<Patient>>() {
                    @Override
                    public void onResponse(Call<PaginatedResponse<Patient>> call,
                                           Response<PaginatedResponse<Patient>> response) {
                        progressBar.setVisibility(View.GONE);
                        if (response.isSuccessful() && response.body() != null) {
                            adapter.updateList(response.body().getData());
                        }
                    }

                    @Override
                    public void onFailure(Call<PaginatedResponse<Patient>> call, Throwable t) {
                        progressBar.setVisibility(View.GONE);
                        Toast.makeText(PatientListActivity.this,
                                "Erro ao carregar pacientes", Toast.LENGTH_SHORT).show();
                    }
                });
    }
}