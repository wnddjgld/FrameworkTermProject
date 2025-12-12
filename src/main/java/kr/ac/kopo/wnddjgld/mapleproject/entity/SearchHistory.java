package kr.ac.kopo.wnddjgld.mapleproject.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;  // ← 추가!
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "search_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore  // ← 이 줄 추가!
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

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime searchedAt;
}