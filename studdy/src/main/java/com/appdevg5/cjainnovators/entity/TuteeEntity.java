package com.appdevg5.cjainnovators.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "tutee")
public class TuteeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tuteeId;

    // Foreign key relationship
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @OneToMany(mappedBy = "tutee")
    @Builder.Default
    private List<SessionEntity> sessions = new ArrayList<>();

    @OneToMany(mappedBy = "tutee", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<TuteeSubjectEntity> subjects = new ArrayList<>();

    private int hoursStudied;
}
