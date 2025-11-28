package com.foodtech.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping("/check")
    public Map<String, String> checkHealth() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "OK ✅ Backend funcionando correctamente");
        return response;
    }
}
