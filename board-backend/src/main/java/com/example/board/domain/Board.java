package com.example.board.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "board")
@Getter 
@Setter 
@NoArgsConstructor // JPA 필수 기본 생성자
public class Board {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 50)
    private String writer;

    @Lob
    @Column(nullable = false)
    private String content;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "is_notice")
    private boolean isNotice = false; // 📢 공지사항 여부

    @Column(name = "view_count", nullable = false)
    private int viewCount = 0;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Board(String title, String writer, String content) {
        this.title = title;
        this.writer = writer;
        this.content = content;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void update(String title, String writer, String content) {
        this.title = title;
        this.writer = writer;
        this.content = content;
    }

    public void increaseViewCount() {
        this.viewCount++;
    }
}