package com.example.board.service;

import com.example.board.domain.ChatMessage;
import com.example.board.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.*;

@Service
public class AiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    public String getCounselingWithHistory(String roomId, String userMessage) {
        // Gemini API URL
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" + apiKey;

        try {
            // 1. 사용자 질문 DB 저장
            chatMessageRepository.save(new ChatMessage(roomId, "user", userMessage));

            // 2. 과거 대화 내역 조회
            List<ChatMessage> history = chatMessageRepository.findByRoomIdOrderByCreatedAtAsc(roomId);

            // 3. Gemini API 보낼 contents 규격 생성
            List<Map<String, Object>> contents = new ArrayList<>();

            String systemInstruction = "너는 '몽글몽글 게시판'의 다정한 AI 상담원 '몽글이'야. "
                    + "사용자의 고민을 들으면 친한 친구처럼 따뜻하게 공감하고 위로해줘. "
                    + "존댓말을 사용하고, 파스텔 톤의 이모티콘(🌸, ✨, 💖, ☁️)을 적절히 사용해줘. "
                    + "이전 대화 맥락을 잘 기억하면서 다정하게 3~4문장으로 답장해줘.";

            for (int i = 0; i < history.size(); i++) {
                ChatMessage msg = history.get(i);
                Map<String, Object> contentMap = new HashMap<>();

                // role은 user 또는 model로 명확히 고정
                String role = "user".equalsIgnoreCase(msg.getRole()) ? "user" : "model";
                contentMap.put("role", role);

                List<Map<String, String>> parts = new ArrayList<>();
                Map<String, String> part = new HashMap<>();

                // 첫 사용자 메시지에 캐릭터 프롬프트 합성
                if (i == 0 && "user".equals(role)) {
                    part.put("text", systemInstruction + "\n\n사용자의 고민: " + msg.getMessage());
                } else {
                    part.put("text", msg.getMessage());
                }

                parts.add(part);
                contentMap.put("parts", parts);
                contents.add(contentMap);
            }

            // HTTP 요청 설정
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", contents);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            // API 호출
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            // 응답 데이터 파싱
            List candidates = (List) response.getBody().get("candidates");
            Map firstCandidate = (Map) candidates.get(0);
            Map contentResp = (Map) firstCandidate.get("content");
            List partsResp = (List) contentResp.get("parts");
            Map firstPart = (Map) partsResp.get(0);

            String aiReply = (String) firstPart.get("text");

            // 4. AI 답변 DB 저장
            chatMessageRepository.save(new ChatMessage(roomId, "model", aiReply));

            return aiReply;

        } catch (HttpClientErrorException e) {
            // Gemini API 쪽에서 발생한 에러 (API 키 오류, 요청 포맷 오류 등)
            System.err.println("❌ [Gemini API 에러 발생] 상태코드: " + e.getStatusCode());
            System.err.println("❌ 에러 본문: " + e.getResponseBodyAsString());
            return "몽글이가 구름 뒤에서 생각에 잠겼어요... ☁️ (API 키나 요청 형식을 확인해 주세요!)";

        } catch (Exception e) {
            // 기타 DB나 자바 백엔드 에러
            System.err.println("❌ [백엔드 내부 에러 발생]:");
            e.printStackTrace();
            return "몽글이가 잠시 쉬어가고 있어요! 🍵 (백엔드 에러 발생)";
        }
    }


        public String generateFortuneCookie() {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" + apiKey;

        try {
            List<Map<String, Object>> contents = new ArrayList<>();
            Map<String, Object> contentMap = new HashMap<>();
            contentMap.put("role", "user");

            List<Map<String, String>> parts = new ArrayList<>();
            Map<String, String> part = new HashMap<>();

            // 포춘쿠키 전용 프롬프트 설정
            String prompt = "너는 다정한 몽글이 상담소의 포춘쿠키야. "
                    + "오늘 하루 사용자에게 힘이 될 짧고 따뜻한 행운의 메시지를 작성해줘. "
                    + "아래 형식에 맞춰서 짧고 임팩트 있게 작성해줘.\n\n"
                    + "[오늘의 운세 한 줄]\n"
                    + "[몽글이의 한마디 위로]\n"
                    + "🍀 행운의 아이템: (예: 따뜻한 아메리카노, 분홍색 소품 등)";

            part.put("text", prompt);
            parts.add(part);
            contentMap.put("parts", parts);
            contents.add(contentMap);

            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", contents);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            // 응답 파싱
            List candidates = (List) response.getBody().get("candidates");
            Map firstCandidate = (Map) candidates.get(0);
            Map contentResp = (Map) firstCandidate.get("content");
            List partsResp = (List) contentResp.get("parts");
            Map firstPart = (Map) partsResp.get(0);

            return (String) firstPart.get("text");

        } catch (Exception e) {
            System.err.println("❌ 포춘쿠키 생성 실패: " + e.getMessage());
            return "🥠 [오늘의 포춘쿠키]\n당신의 오늘 하루는 구름처럼 가볍고 포근할 거예요! ✨\n🍀 행운의 아이템: 달콤한 디저트";
        }
    }
}