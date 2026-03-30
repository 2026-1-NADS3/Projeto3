package com.maya.rpg.model;

import com.google.gson.annotations.SerializedName;

public class User {
    @SerializedName("id")
    private String id;

    @SerializedName("name")
    private String name;

    @SerializedName("email")
    private String email;

    @SerializedName("token")
    private String token;

    public String getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getToken() { return token; }
}