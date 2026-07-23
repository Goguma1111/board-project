package com.example.board.dto;

import jakarta.validation.constraints.NotBlank;

public class BoardRequest {

    @NotBlank(message = "제목을 입력해주세요.")
    private String title;

    private String writer;

    @NotBlank(message = "내용을 입력해주세요.")
    private String content;

    private String imageUrl;

    // 📢 공지사항 여부 필드 추가!
    private boolean isNotice = false;

    public BoardRequest() {
    }

    public BoardRequest(String title, String writer, String content) {
        this.title = title;
        this.writer = writer;
        this.content = content;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getWriter() {
        return writer;
    }

    public void setWriter(String writer) {
        this.writer = writer;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    // 📢 공지사항 Getter & Setter 추가
    public boolean isNotice() {
        return isNotice;
    }

    public void setNotice(boolean notice) {
        isNotice = notice;
    }
}