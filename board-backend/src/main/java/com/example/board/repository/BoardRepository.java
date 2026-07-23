package com.example.board.repository;

import com.example.board.domain.Board;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Long> {

    List<Board> findAllByOrderByIdDesc();

    List<Board> findByTitleContainingOrderByIdDesc(String keyword);

    // 📢 3. [추가] 공지사항 우선 정렬 후, 최신순 조회!
    List<Board> findAllByOrderByIsNoticeDescIdDesc();
}
