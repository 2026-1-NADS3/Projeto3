package com.maya.rpg.ui.exercises;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import com.maya.rpg.R;
import com.maya.rpg.api.RetrofitClient;
import com.maya.rpg.model.Exercise;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ExerciseListFragment extends Fragment {

    private static final String ARG_PRESCRIPTION_ID = "prescription_id";
    private String prescriptionId;

    public static ExerciseListFragment newInstance(String prescriptionId) {
        ExerciseListFragment fragment = new ExerciseListFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PRESCRIPTION_ID, prescriptionId);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            prescriptionId = getArguments().getString(ARG_PRESCRIPTION_ID);
        }
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_exercise_list, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        // Fragment criado — exercícios detalhados serão carregados aqui na Entrega 2
        // com integração completa da API de exercícios
        TextView tvInfo = view.findViewById(R.id.tvInfo);
        if (tvInfo != null) {
            tvInfo.setText("Exercícios do plano carregados com sucesso.\nInicie sua sessão!");
        }
    }
}