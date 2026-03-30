package com.maya.rpg.ui.exercises;

import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.maya.rpg.R;
import com.maya.rpg.api.RetrofitClient;
import com.maya.rpg.api.TokenManager;
import com.maya.rpg.model.Prescription;
import com.maya.rpg.model.PaginatedResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ExercisePlanActivity extends AppCompatActivity {

    private RecyclerView rvPrescriptions;
    private ProgressBar progressBar;
    private LinearLayout layoutEmpty;
    private EditText etSearch;
    private PrescriptionAdapter adapter;
    private List<Prescription> allPrescriptions = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_exercise_plan);

        rvPrescriptions = findViewById(R.id.rvPrescriptions);
        progressBar = findViewById(R.id.progressBar);
        layoutEmpty = findViewById(R.id.layoutEmpty);
        etSearch = findViewById(R.id.etSearch);

        adapter = new PrescriptionAdapter(new ArrayList<>(), prescription -> {
            Intent intent = new Intent(this, ExerciseDetailActivity.class);
            intent.putExtra("prescription_id", prescription.getId());
            intent.putExtra("prescription_title", prescription.getTitle());
            intent.putExtra("prescription_description", prescription.getDescription());
            startActivity(intent);
        });

        rvPrescriptions.setLayoutManager(new LinearLayoutManager(this));
        rvPrescriptions.setAdapter(adapter);

        findViewById(R.id.btnBack).setOnClickListener(v -> finish());

        etSearch.addTextChangedListener(new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override public void afterTextChanged(Editable s) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                filterPrescriptions(s.toString());
            }
        });

        loadPrescriptions();
    }

    private void loadPrescriptions() {
        String patientId = TokenManager.getPatientId();
        if (patientId == null) {
            Toast.makeText(this, "Paciente não identificado", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        progressBar.setVisibility(View.VISIBLE);
        layoutEmpty.setVisibility(View.GONE);

        RetrofitClient.getApiService()
                .getPrescriptionsByPatient(patientId, 1, 50)
                .enqueue(new Callback<PaginatedResponse<Prescription>>() {
                    @Override
                    public void onResponse(Call<PaginatedResponse<Prescription>> call,
                                           Response<PaginatedResponse<Prescription>> response) {
                        progressBar.setVisibility(View.GONE);

                        if (response.isSuccessful() && response.body() != null) {
                            allPrescriptions = response.body().getData();
                            if (allPrescriptions.isEmpty()) {
                                layoutEmpty.setVisibility(View.VISIBLE);
                            } else {
                                adapter.updateList(allPrescriptions);
                            }
                        } else {
                            layoutEmpty.setVisibility(View.VISIBLE);
                        }
                    }

                    @Override
                    public void onFailure(Call<PaginatedResponse<Prescription>> call, Throwable t) {
                        progressBar.setVisibility(View.GONE);
                        layoutEmpty.setVisibility(View.VISIBLE);
                        Toast.makeText(ExercisePlanActivity.this,
                                "Erro ao carregar plano", Toast.LENGTH_SHORT).show();
                    }
                });
    }

    private void filterPrescriptions(String query) {
        if (query.isEmpty()) {
            adapter.updateList(allPrescriptions);
            return;
        }
        List<Prescription> filtered = allPrescriptions.stream()
                .filter(p -> p.getTitle().toLowerCase().contains(query.toLowerCase()))
                .collect(Collectors.toList());
        adapter.updateList(filtered);
        layoutEmpty.setVisibility(filtered.isEmpty() ? View.VISIBLE : View.GONE);
    }
}