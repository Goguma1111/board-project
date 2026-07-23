package com.example.board.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // 1. CORS 설정 (API 호출 및 이미지 파일 접근 허용)
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                // Vite 개발 서버 주소. 배포 시 실제 프론트엔드 도메인으로 바꿔주세요.
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }


    // 2. 정적 리소스(업로드한 GIF/이미지 파일) 매핑 설정  추가된 부분!
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // http://localhost:8081/uploads/파일명.gif 로 요청이 오면
        // 프로젝트 루에 있는 uploads/ 폴더에서 실제 파일을 찾아서 브라우저에 보여줍니다.
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:./uploads/");
    }
}
