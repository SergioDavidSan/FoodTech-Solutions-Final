package com.foodtech.repository;

import com.foodtech.model.LogAcceso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LogAccesoRepository extends JpaRepository<LogAcceso, Long> {
}