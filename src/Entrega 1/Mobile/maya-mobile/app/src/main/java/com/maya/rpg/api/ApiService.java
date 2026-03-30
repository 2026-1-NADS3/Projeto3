package com.maya.rpg.api;

import com.maya.rpg.model.LoginRequest;
import com.maya.rpg.model.LoginResponse;
import com.maya.rpg.model.Patient;
import com.maya.rpg.model.PaginatedResponse;
import com.maya.rpg.model.RegisterRequest;
import com.maya.rpg.model.Prescription;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Path;
import retrofit2.http.Query;

public interface ApiService {

    @POST("auth/login")
    Call<LoginResponse> login(@Body LoginRequest request);

    @GET("patients")
    Call<PaginatedResponse<Patient>> getPatients(
            @Query("page") int page,
            @Query("pageSize") int pageSize,
            @Query("search") String search
    );

    @GET("patients/{id}")
    Call<Patient> getPatientById(@Path("id") String id);

    @GET("patients/me")
    Call<Patient> getMyPatient();

    @POST("auth/register")
    Call<LoginResponse> register(@Body RegisterRequest request);

    @GET("prescriptions/patient/{patientId}")
    Call<PaginatedResponse<Prescription>> getPrescriptionsByPatient(
            @Path("patientId") String patientId,
            @Query("page") int page,
            @Query("pageSize") int pageSize
    );
}