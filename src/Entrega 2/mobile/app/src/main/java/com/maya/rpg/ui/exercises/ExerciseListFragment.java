package com.maya.rpg.ui.exercises;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.gson.Gson;
import com.maya.rpg.R;
import com.maya.rpg.model.Prescription;

import java.util.ArrayList;
import java.util.List;

public class ExerciseListFragment extends Fragment {

    private RecyclerView rvPrescriptions;
    private ProgressBar progressBar;
    private PrescriptionAdapter adapter;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_exercise_list, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        rvPrescriptions = view.findViewById(R.id.rvPrescriptions);
        progressBar = view.findViewById(R.id.progressBar);

        setupRecyclerView();
    }

    private void setupRecyclerView() {
        adapter = new PrescriptionAdapter(new ArrayList<>(), prescription -> {
            Intent intent = new Intent(getContext(), ExerciseDetailActivity.class);
            intent.putExtra("prescription_json", new Gson().toJson(prescription));
            startActivity(intent);
        });

        rvPrescriptions.setLayoutManager(new LinearLayoutManager(getContext()));
        rvPrescriptions.setAdapter(adapter);
    }

    public void updateList(List<Prescription> prescriptions) {
        if (adapter != null) {
            adapter.updateList(prescriptions);
        }
    }

    public void showLoading(boolean isLoading) {
        if (progressBar != null) {
            progressBar.setVisibility(isLoading ? View.VISIBLE : View.GONE);
        }
    }
}
