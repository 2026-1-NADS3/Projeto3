package com.maya.rpg.ui.exercises;

import android.os.Bundle;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;
import com.maya.rpg.R;

public class ExerciseDetailActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_exercise_detail);

        String prescriptionId = getIntent().getStringExtra("prescription_id");
        String title = getIntent().getStringExtra("prescription_title");
        String description = getIntent().getStringExtra("prescription_description");

        TextView tvTitle = findViewById(R.id.tvTitle);
        TextView tvDescription = findViewById(R.id.tvDescription);
        if (tvTitle != null) tvTitle.setText(title);
        if (tvDescription != null && description != null) tvDescription.setText(description);

        findViewById(R.id.btnBack).setOnClickListener(v -> finish());

        // Carrega o fragment de exercícios
        if (savedInstanceState == null) {
            ExerciseListFragment fragment = ExerciseListFragment.newInstance(prescriptionId);
            FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
            transaction.replace(R.id.fragmentContainer, fragment);
            transaction.commit();
        }
    }
}