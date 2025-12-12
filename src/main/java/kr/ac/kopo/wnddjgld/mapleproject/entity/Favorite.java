package kr.ac.kopo.wnddjgld.mapleproject.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;  // ← 추가
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "favorites")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore  // ← 이 줄 추가! (user 객체 전체를 JSON에서 제외)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 50)
    private String characterName;

    @Column(length = 100)
    private String ocid;

    @Column(length = 50)
    private String worldName;

    @Column(length = 50)
    private String characterClass;

    @Column
    private Integer characterLevel;

    @Column(length = 255)
    private String characterImage;

    @Column
    private Long combatPower;

    @Column
    private Integer unionLevel;

    @Column
    private Integer popularity;

    @Column(length = 100)
    private String guildName;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}