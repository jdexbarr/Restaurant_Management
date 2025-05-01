package com.restaurant.restaurantapp.service;

import com.restaurant.restaurantapp.dto.TableAvailabilityDTO;
import com.restaurant.restaurantapp.model.Reservation;
import com.restaurant.restaurantapp.model.RestaurantTable;
import com.restaurant.restaurantapp.repository.ReservationRepository;
import com.restaurant.restaurantapp.repository.RestaurantTableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private RestaurantTableRepository tableRepository;

    public Reservation createReservation(Reservation reservation) {
        if (reservation.getReservationDate() == null || reservation.getReservationDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Cannot make a reservation in the past.");
        }

        if (reservation.getNumberOfPeople() <= 0 || reservation.getNumberOfPeople() > 20) {
            throw new IllegalArgumentException("Number of people must be between 1 and 20.");
        }

        Long tableId = reservation.getTable().getId();
        LocalDateTime start = reservation.getReservationDate().minusMinutes(59);
        LocalDateTime end = reservation.getReservationDate().plusMinutes(59);

        // ✅ PASAR Long directamente, sin convertir a int
        List<Reservation> conflicting = reservationRepository.findConflictingReservations(start, end, tableId);

        if (!conflicting.isEmpty()) {
            throw new IllegalArgumentException("This table is already booked within an hour of the selected time.");
        }

        return reservationRepository.save(reservation);
    }

    public Optional<Reservation> findById(Long id) {
        return reservationRepository.findById(id);
    }

    public List<Reservation> findAll() {
        return reservationRepository.findAll();
    }

    public List<Reservation> findByClientId(Long clientId) {
        return reservationRepository.findByClientId(clientId);
    }

    public void deleteReservation(Long id) {
        reservationRepository.deleteById(id);
    }

    public List<Object[]> getReservationsCountByDate() {
        return reservationRepository.countReservationsByDate();
    }

    public List<Object[]> getReservationsCountByClient() {
        return reservationRepository.countReservationsByClient();
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public List<Reservation> getReservationsByUserId(Long userId) {
        return reservationRepository.findByClientId(userId);
    }

    public Reservation updateReservation(Long id, Reservation updatedReservation) {
        Reservation existingReservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        existingReservation.setReservationDate(updatedReservation.getReservationDate());
        existingReservation.setNumberOfPeople(updatedReservation.getNumberOfPeople());
        existingReservation.setStatus(updatedReservation.getStatus());
        existingReservation.setTable(updatedReservation.getTable());

        return reservationRepository.save(existingReservation);
    }

    public Optional<Reservation> getReservationById(Long id) {
        return reservationRepository.findById(id);
    }

    public List<TableAvailabilityDTO> getTableAvailability(LocalDateTime dateTime) {
        List<RestaurantTable> allTables = tableRepository.findAll();

        List<Reservation> reservationsAtTime = reservationRepository
                .findByReservationDateBetween(dateTime.minusMinutes(59), dateTime.plusMinutes(59));

        Set<Long> reservedTableIds = reservationsAtTime.stream()
                .map(res -> res.getTable().getId())
                .collect(Collectors.toSet());

        return allTables.stream()
                .map(table -> new TableAvailabilityDTO(
                        table.getId(),
                        table.getTableNumber(),
                        table.getSeats(),
                        reservedTableIds.contains(table.getId())
                ))
                .collect(Collectors.toList());
    }
}




