package com.example.board.service;

import com.example.board.domain.Board;
import com.example.board.dto.BoardRequest;
import com.example.board.repository.BoardRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class BoardService {

    private final BoardRepository boardRepository;

    public BoardService(BoardRepository boardRepository) {
        this.boardRepository = boardRepository;
    }

    // 🌸 게시글 목록 조회 및 검색 (getBoards)
    @Transactional(readOnly = true)
    public List<Board> getBoards(String keyword) {
        if (keyword != null && !keyword.isBlank()) {
            return boardRepository.findByTitleContainingOrderByIdDesc(keyword);
        }
        return boardRepository.findAllByOrderByIsNoticeDescIdDesc();
    }

    // 🌸 게시글 전체 조회 (키워드 없을 때)
    @Transactional(readOnly = true)
    public List<Board> getAllBoards() {
        return boardRepository.findAllByOrderByIsNoticeDescIdDesc();
    }

    // 🌸 게시글 생성
    public Board createBoard(BoardRequest request) {
        Board board = new Board();
        board.setTitle(request.getTitle());
        board.setContent(request.getContent());
        board.setWriter(request.getWriter());
        board.setImageUrl(request.getImageUrl());
        board.setNotice(request.isNotice());

        return boardRepository.save(board);
    }

    // 🌸 게시글 수정
    public Board updateBoard(Long id, BoardRequest request) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 존재하지 않습니다. id=" + id));

        board.setTitle(request.getTitle());
        board.setContent(request.getContent());
        board.setWriter(request.getWriter());
        board.setImageUrl(request.getImageUrl());
        board.setNotice(request.isNotice());

        return board;
    }

    // 🌸 게시글 상세 조회
    @Transactional
    public Board getBoardById(Long id) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 존재하지 않습니다. id=" + id));
        board.increaseViewCount();
        return board;
    }

    // 🌸 게시글 삭제
    public void deleteBoard(Long id) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 존재하지 않습니다. id=" + id));
        boardRepository.delete(board);
    }
}