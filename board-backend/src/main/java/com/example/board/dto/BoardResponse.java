package com.example.board.dto;

import com.example.board.domain.Board;
import java.time.LocalDateTime;

public class BoardResponse {

    private Long id;
    private String title;
    private String writer;
    private String content;
    private String imageUrl;
    private boolean isNotice; // 👈 🌸 공지사항 여부 필드 추가!
    private int viewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 🌸 기본 생성자 (convertToDto 및 프레임워크 사용용)
    public BoardResponse() {}

    // 🌸 Entity 기반 생성자
    public BoardResponse(Board board) {
        this.id = board.getId();
        this.title = board.getTitle();
        this.writer = board.getWriter();
        this.content = board.getContent();
        this.viewCount = board.getViewCount();
        this.createdAt = board.getCreatedAt();
        this.updatedAt = board.getUpdatedAt();
        this.imageUrl = board.getImageUrl();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getWriter() { return writer; }
    public void setWriter(String writer) { this.writer = writer; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public int getViewCount() { return viewCount; }
    public void setViewCount(int viewCount) { this.viewCount = viewCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public boolean isNotice() { return isNotice; }
    public void setNotice(boolean notice) { isNotice = notice; }
}