package com.example.board.service;

import com.example.board.domain.Board;
import com.example.board.dto.BoardRequest;
import com.example.board.dto.BoardResponse;
import com.example.board.repository.BoardRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class BoardService {

    private final BoardRepository boardRepository;

    public BoardService(BoardRepository boardRepository) {
        this.boardRepository = boardRepository;
    }

    public List<BoardResponse> getBoards(String keyword) {
        List<Board> boards = (keyword == null || keyword.isBlank())
                ? boardRepository.findAllByOrderByIdDesc()
                : boardRepository.findByTitleContainingOrderByIdDesc(keyword);

        return boards.stream()
                .map(BoardResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public BoardResponse getBoard(Long id) {
        Board board = findBoardOrThrow(id);
        board.increaseViewCount();
        return new BoardResponse(board);
    }

    @Transactional
    public BoardResponse createBoard(BoardRequest request) {
        Board board = new Board(request.getTitle(), request.getWriter(), request.getContent());
        Board saved = boardRepository.save(board);
        return new BoardResponse(saved);
    }

    @Transactional
    public BoardResponse updateBoard(Long id, BoardRequest request) {
        Board board = findBoardOrThrow(id);
        board.update(request.getTitle(), request.getWriter(), request.getContent());
        return new BoardResponse(board);
    }

    @Transactional
    public void deleteBoard(Long id) {
        Board board = findBoardOrThrow(id);
        boardRepository.delete(board);
    }

    private Board findBoardOrThrow(Long id) {
        return boardRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다. id=" + id));
    }
}
