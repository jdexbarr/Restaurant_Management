package com.restaurant.restaurantapp.controller;

import com.restaurant.restaurantapp.dto.TableAvailabilityDTO;
import com.restaurant.restaurantapp.model.Reservation;
import com.restaurant.restaurantapp.model.Client;
import com.restaurant.restaurantapp.service.ReservationService;
import com.restaurant.restaurantapp.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "*")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private ClientService clientService;

    // Create a reservation
    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody Reservation reservation) {
        try {
            Reservation newReservation = reservationService.createReservation(reservation);
            return ResponseEntity.ok(newReservation);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get all reservations
    @GetMapping
    public ResponseEntity<List<Reservation>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    // Report: Get reservations count by date (ADMIN only)
    @GetMapping("/reports/by-date")
    public ResponseEntity<?> getReservationsByDate(@RequestHeader("email") String email) {
        Optional<Client> client = clientService.findByEmail(email);
        if (client.isPresent() && "ADMIN".equals(client.get().getRole())) {
            return ResponseEntity.ok(reservationService.getReservationsCountByDate());
        } else {
            return ResponseEntity.status(403).body("Access Denied");
        }
    }

    // Report: Get reservations count by client (ADMIN only)
    @GetMapping("/reports/by-client")
    public ResponseEntity<?> getReservationsByClient(@RequestHeader("email") String email) {
        Optional<Client> client = clientService.findByEmail(email);
        if (client.isPresent() && "ADMIN".equals(client.get().getRole())) {
            return ResponseEntity.ok(reservationService.getReservationsCountByClient());
        } else {
            return ResponseEntity.status(403).body("Access Denied");
        }
    }

    // Get reservations by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Reservation>> getReservationsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(reservationService.getReservationsByUserId(userId));
    }

    // Get reservation by ID
    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getReservationById(@PathVariable Long id) {
        Optional<Reservation> reservation = reservationService.getReservationById(id);
        return reservation.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete reservation
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReservation(@PathVariable Long id) {
        reservationService.deleteReservation(id);
        return ResponseEntity.ok("Reservation deleted successfully");
    }

    // Update reservation
    @PutMapping("/{id}")
    public ResponseEntity<Reservation> updateReservation(@PathVariable Long id, @RequestBody Reservation updatedReservation) {
        Reservation reservation = reservationService.updateReservation(id, updatedReservation);
        return ResponseEntity.ok(reservation);
    }

    // 🔥 NEW: Get table availability for a specific date and time
    @GetMapping("/availability")
    public ResponseEntity<?> getTableAvailability(@RequestParam String date, @RequestParam String time) {
        try {
            LocalDate parsedDate = LocalDate.parse(date);   // format: yyyy-MM-dd
            LocalTime parsedTime = LocalTime.parse(time);   // format: HH:mm
            LocalDateTime dateTime = LocalDateTime.of(parsedDate, parsedTime);
            List<TableAvailabilityDTO> availability = reservationService.getTableAvailability(dateTime);
            return ResponseEntity.ok(availability);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid date or time format. Use yyyy-MM-dd and HH:mm");
        }
    }
}

