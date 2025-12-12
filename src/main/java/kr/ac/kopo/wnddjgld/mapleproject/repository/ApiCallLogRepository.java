package kr.ac.kopo.wnddjgld.mapleproject.repository;

import kr.ac.kopo.wnddjgld.mapleproject.entity.ApiCallLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface ApiCallLogRepository extends JpaRepository<ApiCallLog, Long> {

    Optional<ApiCallLog> findByEndpointAndCallDate(String endpoint, LocalDate callDate);
}