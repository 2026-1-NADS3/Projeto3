package com.maya.rpg.model;

import com.google.gson.annotations.SerializedName;

public class LoginResponse {
    @SerializedName("accessToken")
    private String accessToken;

    @SerializedName("user")
    private User user;

    public String getAccessToken() { return accessToken; }
    public User getUser() { return user; }
}