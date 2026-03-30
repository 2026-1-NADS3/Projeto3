package com.maya.rpg.ui.patients;

import android.os.Bundle;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import com.maya.rpg.R;

public class PatientDetailActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_patient_detail);

        String name = getIntent().getStringExtra("patient_name");
        String email = getIntent().getStringExtra("patient_email");
        String phone = getIntent().getStringExtra("patient_phone");
        String cpf = getIntent().getStringExtra("patient_cpf");
        String status = getIntent().getStringExtra("patient_status");
        String notes = getIntent().getStringExtra("patient_notes");

        TextView tvName = findViewById(R.id.tvName);
        TextView tvInitials = findViewById(R.id.tvInitials);
        TextView tvStatus = findViewById(R.id.tvStatus);
        TextView tvEmail = findViewById(R.id.tvEmail);
        TextView tvPhone = findViewById(R.id.tvPhone);
        TextView tvCpf = findViewById(R.id.tvCpf);
        TextView tvNotes = findViewById(R.id.tvNotes);

        tvName.setText(name);
        tvEmail.setText(email != null ? email : "-");
        tvPhone.setText(phone != null ? phone : "-");
        tvCpf.setText(cpf != null ? cpf : "-");
        tvNotes.setText(notes != null && !notes.isEmpty() ? notes : "Nenhuma observação");

        // Iniciais
        if (name != null) {
            String[] parts = name.split(" ");
            String initials = parts.length >= 2
                    ? String.valueOf(parts[0].charAt(0)) + parts[1].charAt(0)
                    : String.valueOf(parts[0].charAt(0));
            tvInitials.setText(initials.toUpperCase());
        }

        // Status
        if (status != null) {
            switch (status) {
                case "ACTIVE": tvStatus.setText("● Ativo"); break;
                case "INACTIVE": tvStatus.setText("● Inativo"); break;
                default: tvStatus.setText("● Pendente"); break;
            }
        }

        findViewById(R.id.btnBack).setOnClickListener(v -> finish());
    }
}