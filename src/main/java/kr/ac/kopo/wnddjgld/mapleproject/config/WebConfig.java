package kr.ac.kopo.wnddjgld.mapleproject.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:8080")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // URL without .html extension
        registry.addViewController("/dashboard").setViewName("forward:/dashboard.html");
        registry.addViewController("/login").setViewName("forward:/login.html");
        registry.addViewController("/character").setViewName("forward:/character.html");
        registry.addViewController("/signup").setViewName("forward:/signup.html");
        registry.addViewController("/favorites").setViewName("forward:/favorites.html");
        registry.addViewController("/history").setViewName("forward:/history.html");
        registry.addViewController("/compare").setViewName("forward:/compare.html");
        registry.addViewController("/loading").setViewName("forward:/loading.html");
    }
}