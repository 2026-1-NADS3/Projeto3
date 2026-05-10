package com.maya.rpg.model;

import com.google.gson.annotations.SerializedName;

/**
 * Resposta do endpoint POST /auth/recover-password.
 * Em ambiente de desenvolvimento, o backend retorna o token diretamente
 * em devToken para facilitar o teste sem dependência de e-mail.
 */
public class RecoverPasswordResponse {
    @SerializedName("message")
    private String message;

    @SerializedName("devToken")
    private String devToken;

    public String getMessage() {
        return message;
    }

    public String getDevToken() {
        return devToken;
    }
}
