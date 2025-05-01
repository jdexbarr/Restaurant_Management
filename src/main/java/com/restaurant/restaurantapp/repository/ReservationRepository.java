package com.restaurant.restaurantapp.repository;

import com.restaurant.restaurantapp.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    long countByStatus(String status);

    List<Reservation> findByClientId(Long clientId);

    @Query("SELECT r.reservationDate, COUNT(r) FROM Reservation r GROUP BY r.reservationDate ORDER BY r.reservationDate")
    List<Object[]> countReservationsByDate();

    @Query("SELECT r.client.email, COUNT(r) FROM Reservation r GROUP BY r.client.email")
    List<Object[]> countReservationsByClient();

    // ✅ Corregido: uso de r.table.id en lugar de r.tableId
    @Query("SELECT r FROM Reservation r WHERE r.reservationDate BETWEEN :start AND :end AND r.table.id = :tableId")
    List<Reservation> findConflictingReservations(@Param("start") LocalDateTime start,
                                                  @Param("end") LocalDateTime end,
                                                  @Param("tableId") Long tableId);

    // Ver disponibilidad de mesas por franja de tiempo
    List<Reservation> findByReservationDateBetween(LocalDateTime start, LocalDateTime end);
}


