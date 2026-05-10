package com.maya.rpg.ui.exercises;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.EditText;
import android.widget.Toast;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.fragment.app.FragmentManager;

import com.maya.rpg.R;
import com.maya.rpg.api.RetrofitClient;
import com.maya.rpg.api.TokenManager;
import com.maya.rpg.db.OfflineManager;
import com.maya.rpg.model.FullPrescriptionsResponse;
import com.maya.rpg.model.Prescription;
import com.maya.rpg.ui.BaseAuthActivity;
import com.maya.rpg.ui.evolution.EvolutionActivity;
import com.maya.rpg.ui.home.HomeActivity;
import com.maya.rpg.ui.profile.ProfileActivity;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ExercisePlanActivity extends BaseAuthActivity {

    private ConstraintLayout skeletonLayout;
    private ConstraintLayout layoutEmpty;
    private ConstraintLayout layoutOfflineBanner;
    private EditText etSearch;
    private List<Prescription> allPrescriptions = new ArrayList<>();
    private ExerciseListFragment listFragment;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_exercise_plan);

        skeletonLayout = findViewById(R.id.skeletonLayout);
        layoutEmpty = findViewById(R.id.layoutEmpty);
        layoutOfflineBanner = findViewById(R.id.layoutOfflineBanner);
        etSearch = findViewById(R.id.etSearch);

        FragmentManager fm = getSupportFragmentManager();
        listFragment = (ExerciseListFragment) fm.findFragmentById(R.id.fragmentContainer);

        setupBottomNav();

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

    private void showLoading(boolean isLoading) {
        if (isLoading) {
            if (listFragment != null) listFragment.showLoading(true);
            layoutEmpty.setVisibility(View.GONE);
            layoutOfflineBanner.setVisibility(View.GONE);
            skeletonLayout.setVisibility(View.VISIBLE);

            Animation pulse = AnimationUtils.loadAnimation(this, R.anim.shimmer_pulse);
            skeletonLayout.startAnimation(pulse);
        } else {
            if (listFragment != null) listFragment.showLoading(false);
            skeletonLayout.clearAnimation();
            skeletonLayout.setVisibility(View.GONE);
        }
    }

    private void showEmptyState() {
        layoutEmpty.setVisibility(View.VISIBLE);
        layoutOfflineBanner.setVisibility(View.GONE);
        if (listFragment != null) listFragment.updateList(new ArrayList<>());
    }

    private void loadPrescriptions() {
        String patientId = TokenManager.getPatientId();
        if (patientId == null) {
            Toast.makeText(this, "Paciente não identificado", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        showLoading(true);

        RetrofitClient.getApiService()
                .getMyFullPrescriptions()
                .enqueue(new Callback<FullPrescriptionsResponse>() {
                    @Override
                    public void onResponse(Call<FullPrescriptionsResponse> call,
                                           Response<FullPrescriptionsResponse> response) {
                        
                        showLoading(false);

                        if (response.isSuccessful() && response.body() != null) {
                            allPrescriptions = response.body().getData();
                            
                            if (allPrescriptions == null || allPrescriptions.isEmpty()) {
                                showEmptyState();
                            } else {
                                OfflineManager.cachePrescriptions(
                                        ExercisePlanActivity.this, patientId, allPrescriptions);
                                if (listFragment != null) listFragment.updateList(allPrescriptions);
                            }
                        } 
                        else if (response.code() == 401) {
                            TokenManager.clearAll();
                            startActivity(new Intent(ExercisePlanActivity.this,
                                    com.maya.rpg.ui.auth.LoginActivity.class));
                            finishAffinity();
                        }
                        else {
                            loadFromCache(patientId);
                        }
                    }

                    @Override
                    public void onFailure(Call<FullPrescriptionsResponse> call, Throwable t) {
                        showLoading(false);
                        loadFromCache(patientId);
                    }
                });
    }

    private void loadFromCache(String patientId) {
        Handler mainHandler = new Handler(Looper.getMainLooper());
        OfflineManager.loadCachedPrescriptions(this, patientId, mainHandler, cached -> {
            if (cached != null && !cached.isEmpty()) {
                allPrescriptions = cached;
                if (listFragment != null) listFragment.updateList(allPrescriptions);
                layoutOfflineBanner.setVisibility(View.VISIBLE);
                layoutEmpty.setVisibility(View.GONE);
            } else {
                showEmptyState();
                Toast.makeText(this,
                        "Sem conexão e sem cache local disponível.", Toast.LENGTH_LONG).show();
            }
        });
    }

    private void setupBottomNav() {
        findViewById(R.id.navHome).setOnClickListener(v -> {
            startActivity(new Intent(this, HomeActivity.class));
            finish();
        });
        findViewById(R.id.navExercises).setOnClickListener(v -> {
            // Already here
        });
        findViewById(R.id.navEvolution).setOnClickListener(v -> {
            startActivity(new Intent(this, EvolutionActivity.class));
        });
        findViewById(R.id.navMore).setOnClickListener(v -> {
            startActivity(new Intent(this, ProfileActivity.class));
        });
    }

    private void filterPrescriptions(String query) {
        if (query.isEmpty()) {
            if (listFragment != null) listFragment.updateList(allPrescriptions);
            layoutEmpty.setVisibility(View.GONE);
            return;
        }
        List<Prescription> filtered = allPrescriptions.stream()
                .filter(p -> p.getTitle().toLowerCase().contains(query.toLowerCase()))
                .collect(Collectors.toList());
        
        if (listFragment != null) listFragment.updateList(filtered);
        
        if (filtered.isEmpty()) {
            layoutEmpty.setVisibility(View.VISIBLE);
        } else {
            layoutEmpty.setVisibility(View.GONE);
        }
    }
}
