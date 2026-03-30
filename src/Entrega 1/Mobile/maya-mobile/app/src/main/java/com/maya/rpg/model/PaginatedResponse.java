package com.maya.rpg.model;

import com.google.gson.annotations.SerializedName;
import java.util.List;

public class PaginatedResponse<T> {
    @SerializedName("data")
    private List<T> data;

    @SerializedName("total")
    private int total;

    @SerializedName("page")
    private int page;

    @SerializedName("totalPages")
    private int totalPages;

    public List<T> getData() { return data; }
    public int getTotal() { return total; }
    public int getPage() { return page; }
    public int getTotalPages() { return totalPages; }
}