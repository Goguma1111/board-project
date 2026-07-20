package com.example.board.dto;

import com.example.board.domain.Board;

import java.time.LocalDateTime;

public class BoardResponse {

    private Long id;
    private String title;
    private String writer;
    private String content;
    private int viewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public BoardResponse(Board board) {
        this.id = board.getId();
        this.title = board.getTitle();
        this.writer = board.getWriter();
        this.content = board.getContent();
        this.viewCount = board.getViewCount();
        this.createdAt = board.getCreatedAt();
        this.updatedAt = board.getUpdatedAt();
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getWriter() {
        return writer;
    }

    public String getContent() {
        return content;
    }

    public int getViewCount() {
        return viewCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
