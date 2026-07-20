package com.example.board.config;

import com.example.board.domain.Board;
import com.example.board.repository.BoardRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final BoardRepository boardRepository;

    public DataInitializer(BoardRepository boardRepository) {
        this.boardRepository = boardRepository;
    }

    @Override
    public void run(String... args) {
        if (boardRepository.count() == 0) {
            boardRepository.save(new Board(
                    "게시판에 오신 것을 환영합니다",
                    "관리자",
                    "이곳은 React 프론트엔드 테스트를 위한 샘플 게시글입니다."));
            boardRepository.save(new Board(
                    "제목 검색 테스트용 게시글",
                    "관리자",
                    "상단 검색창에 '검색'을 입력해서 이 글이 나오는지 확인해보세요."));
        }
    }
}
