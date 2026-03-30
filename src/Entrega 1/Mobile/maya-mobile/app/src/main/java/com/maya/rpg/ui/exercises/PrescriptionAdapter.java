package com.maya.rpg.ui.exercises;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.maya.rpg.R;
import com.maya.rpg.model.Prescription;
import java.util.List;

public class PrescriptionAdapter extends RecyclerView.Adapter<PrescriptionAdapter.ViewHolder> {

    private List<Prescription> prescriptions;
    private OnPrescriptionClickListener listener;

    public interface OnPrescriptionClickListener {
        void onStartClick(Prescription prescription);
    }

    public PrescriptionAdapter(List<Prescription> prescriptions, OnPrescriptionClickListener listener) {
        this.prescriptions = prescriptions;
        this.listener = listener;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_prescription, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        holder.bind(prescriptions.get(position), listener);
    }

    @Override
    public int getItemCount() {
        return prescriptions.size();
    }

    public void updateList(List<Prescription> newList) {
        this.prescriptions = newList;
        notifyDataSetChanged();
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        TextView tvTitle, tvDescription, tvExerciseCount;
        Button btnStart;

        ViewHolder(View itemView) {
            super(itemView);
            tvTitle = itemView.findViewById(R.id.tvTitle);
            tvDescription = itemView.findViewById(R.id.tvDescription);
            tvExerciseCount = itemView.findViewById(R.id.tvExerciseCount);
            btnStart = itemView.findViewById(R.id.btnStart);
        }

        void bind(Prescription prescription, OnPrescriptionClickListener listener) {
            tvTitle.setText(prescription.getTitle());
            tvDescription.setText(prescription.getDescription() != null
                    ? prescription.getDescription() : "");

            int count = prescription.getExercises() != null
                    ? prescription.getExercises().size() : 0;
            tvExerciseCount.setText(count + " exercício" + (count != 1 ? "s" : ""));

            btnStart.setOnClickListener(v -> listener.onStartClick(prescription));
            itemView.setOnClickListener(v -> listener.onStartClick(prescription));
        }
    }
}