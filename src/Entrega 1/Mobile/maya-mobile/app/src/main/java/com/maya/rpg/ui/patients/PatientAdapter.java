package com.maya.rpg.ui.patients;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.maya.rpg.R;
import com.maya.rpg.model.Patient;
import java.util.List;

public class PatientAdapter extends RecyclerView.Adapter<PatientAdapter.ViewHolder> {

    private List<Patient> patients;
    private OnPatientClickListener listener;

    public interface OnPatientClickListener {
        void onPatientClick(Patient patient);
    }

    public PatientAdapter(List<Patient> patients, OnPatientClickListener listener) {
        this.patients = patients;
        this.listener = listener;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_patient, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        Patient patient = patients.get(position);
        holder.bind(patient, listener);
    }

    @Override
    public int getItemCount() {
        return patients.size();
    }

    public void updateList(List<Patient> newList) {
        this.patients = newList;
        notifyDataSetChanged();
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        TextView tvInitials, tvName, tvEmail, tvStatus;

        ViewHolder(View itemView) {
            super(itemView);
            tvInitials = itemView.findViewById(R.id.tvInitials);
            tvName = itemView.findViewById(R.id.tvName);
            tvEmail = itemView.findViewById(R.id.tvEmail);
            tvStatus = itemView.findViewById(R.id.tvStatus);
        }

        void bind(Patient patient, OnPatientClickListener listener) {
            tvName.setText(patient.getFullName());
            tvEmail.setText(patient.getEmail());

            // Iniciais
            String[] parts = patient.getFullName().split(" ");
            String initials = parts.length >= 2
                    ? String.valueOf(parts[0].charAt(0)) + parts[1].charAt(0)
                    : String.valueOf(parts[0].charAt(0));
            tvInitials.setText(initials.toUpperCase());

            // Status
            String status = patient.getStatus();
            if (status != null) {
                switch (status) {
                    case "ACTIVE":
                        tvStatus.setText("Ativo");
                        tvStatus.setTextColor(0xFF3A9E6F);
                        break;
                    case "INACTIVE":
                        tvStatus.setText("Inativo");
                        tvStatus.setTextColor(0xFF9A9689);
                        break;
                    default:
                        tvStatus.setText("Pendente");
                        tvStatus.setTextColor(0xFFE6A23C);
                        break;
                }
            }

            itemView.setOnClickListener(v -> listener.onPatientClick(patient));
        }
    }
}