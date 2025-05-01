package com.restaurant.restaurantapp.controller;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.restaurant.restaurantapp.model.Client;
import com.restaurant.restaurantapp.model.Reservation;
import com.restaurant.restaurantapp.service.ClientService;
import com.restaurant.restaurantapp.service.ReservationService;
import com.restaurant.restaurantapp.dto.LoginRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "*")
public class ClientController {

    @Autowired
    private ClientService clientService;

    @Autowired
    private ReservationService reservationService;

    @Value("${jwt.secret}")
    private String jwtSecret;

    // ✅ Register a new client
    @PostMapping("/register")
    public ResponseEntity<?> registerClient(@RequestBody Client client) {
        try {
            client.setRole("CLIENT");
            Client newClient = clientService.registerClient(client);
            return ResponseEntity.ok(newClient);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ Login MODERNO
    @PostMapping("/login")
    public ResponseEntity<?> loginClient(@RequestBody LoginRequest loginRequest) {
        Optional<Client> clientOptional = clientService.login(loginRequest.getEmail(), loginRequest.getPassword());

        if (clientOptional.isPresent()) {
            Client client = clientOptional.get();

            Algorithm algorithm = Algorithm.HMAC256(jwtSecret);
            String token = JWT.create()
                    .withSubject(client.getEmail())
                    .withClaim("role", client.getRole())
                    .withClaim("id", client.getId())
                    .withIssuedAt(new Date())
                    .withExpiresAt(new Date(System.currentTimeMillis() + 86400000))
                    .sign(algorithm);

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", client);

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }

    // ✅ Get client by ID
    @GetMapping("/{id}")
    public ResponseEntity<Client> getClientById(@PathVariable Long id) {
        return clientService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Get all clients
    @GetMapping
    public ResponseEntity<List<Client>> getAllClients() {
        return ResponseEntity.ok(clientService.getAllClients());
    }

    // ✅ Get client reservations
    @GetMapping("/{id}/reservations")
    public ResponseEntity<List<Reservation>> getReservationsForClient(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.getReservationsByUserId(id));
    }

    // ✅ Update profile (name, email, optional image)
    @PutMapping(value = "/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProfile(
            @RequestParam("email") String email,
            @RequestParam("firstName") String firstName,
            @RequestParam("lastName") String lastName,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) {

        Optional<Client> clientOptional = clientService.findByEmail(email);

        if (clientOptional.isPresent()) {
            Client existingClient = clientOptional.get();
            existingClient.setFirstName(firstName);
            existingClient.setLastName(lastName);

            if (profileImage != null && !profileImage.isEmpty()) {
                try {
                    String fileName = UUID.randomUUID() + "_" + profileImage.getOriginalFilename();
                    String uploadDir = "uploads/profile_images/";
                    Path uploadPath = Paths.get(uploadDir);
                    if (!Files.exists(uploadPath)) {
                        Files.createDirectories(uploadPath);
                    }

                    Path filePath = uploadPath.resolve(fileName);
                    Files.copy(profileImage.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                    existingClient.setProfileImage("/" + uploadDir + fileName);

                } catch (IOException e) {
                    return ResponseEntity.status(500).body("Image upload failed: " + e.getMessage());
                }
            }

            return ResponseEntity.ok(clientService.saveClient(existingClient));
        }

        return ResponseEntity.status(404).body("User not found");
    }

    // ✅ Upload image independently
    @PostMapping("/{id}/upload-image")
    public ResponseEntity<String> uploadProfileImage(@PathVariable Long id, @RequestParam("image") MultipartFile imageFile) {
        try {
            Optional<Client> optionalClient = clientService.findById(id);
            if (optionalClient.isEmpty()) {
                return ResponseEntity.status(404).body("Client not found");
            }

            String fileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
            String uploadDir = "uploads/profile_images/";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(fileName);
            Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            Client client = optionalClient.get();
            client.setProfileImage("/" + uploadDir + fileName);
            clientService.saveClient(client);

            return ResponseEntity.ok("Image uploaded successfully");

        } catch (IOException e) {
            return ResponseEntity.status(500).body("Upload failed: " + e.getMessage());
        }
    }
}



