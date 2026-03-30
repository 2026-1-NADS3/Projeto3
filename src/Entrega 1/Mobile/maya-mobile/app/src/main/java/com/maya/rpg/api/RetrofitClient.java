package com.maya.rpg.api;

import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class RetrofitClient {
    private static final String BASE_URL = "https://maya-rpg-api-1t7v.onrender.com/api/";
    private static Retrofit retrofit;
    public static void reset() {
        retrofit = null;
    }
    public static Retrofit getInstance() {
        if (retrofit == null) {
            HttpLoggingInterceptor logging = new HttpLoggingInterceptor();
            logging.setLevel(HttpLoggingInterceptor.Level.BODY);

            OkHttpClient client = new OkHttpClient.Builder()
                    .addInterceptor(logging)
                    .addInterceptor(chain -> {
                        String token = TokenManager.getToken(); // lê sempre na hora da requisição
                        okhttp3.Request original = chain.request();
                        okhttp3.Request request;
                        if (token != null && !token.isEmpty()) {
                            request = original.newBuilder()
                                    .header("Authorization", "Bearer " + token)
                                    .build();
                        } else {
                            request = original;
                        }
                        return chain.proceed(request);
                    })
                    .build();

            retrofit = new Retrofit.Builder()
                    .baseUrl(BASE_URL)
                    .client(client)
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();
        }
        return retrofit;
    }

    public static ApiService getApiService() {
        return getInstance().create(ApiService.class);
    }
}