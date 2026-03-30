package com.maya.rpg.api;

import android.content.Context;
import android.content.SharedPreferences;

public class TokenManager {
    private static final String PREF_NAME = "maya_prefs";
    private static final String KEY_TOKEN = "jwt_token";
    private static final String KEY_PATIENT_ID = "patient_id";
    private static final String KEY_USER_NAME = "user_name";
    private static SharedPreferences prefs;

    public static void init(Context context) {
        prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
    }

    public static void saveToken(String token) {
        prefs.edit().putString(KEY_TOKEN, token).apply();
    }

    public static String getToken() {
        return prefs != null ? prefs.getString(KEY_TOKEN, null) : null;
    }

    public static void clearToken() {
        if (prefs != null) prefs.edit().remove(KEY_TOKEN).apply();
    }

    public static boolean isLoggedIn() {
        return getToken() != null;
    }

    public static void savePatientId(String patientId) {
        prefs.edit().putString(KEY_PATIENT_ID, patientId).apply();
    }

    public static String getPatientId() {
        return prefs != null ? prefs.getString(KEY_PATIENT_ID, null) : null;
    }

    public static void saveUserName(String name) {
        prefs.edit().putString(KEY_USER_NAME, name).apply();
    }

    public static String getUserName() {
        return prefs != null ? prefs.getString(KEY_USER_NAME, null) : null;
    }

    public static void clearAll() {
        if (prefs != null) prefs.edit().clear().apply();
    }
}