package com.example.board.controller;

import com.example.board.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    private AiService aiService;

    @PostMapping("/counsel")
    public Map<String, String> getCounsel(@RequestBody Map<String, String> request) {
        String roomId = request.getOrDefault("roomId", "default_room");
        String userMessage = request.get("message");

        String reply = aiService.getCounselingWithHistory(roomId, userMessage);

        // 💡 문자열 대신 JSON 형태로 변환하여 반환
        Map<String, String> response = new HashMap<>();
        response.put("reply", reply);

        return response; // 브라우저에는 {"reply": "몽글이 대답..."} 형태로 전달됨
    }

    @GetMapping("/fortune")
    public Map<String, String> getFortuneCookie() {
        String fortuneMessage = aiService.generateFortuneCookie();
        
        Map<String, String> response = new HashMap<>();
        response.put("fortune", fortuneMessage);
        
        return response;
    }
}