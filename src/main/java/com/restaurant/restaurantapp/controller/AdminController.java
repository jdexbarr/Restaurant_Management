package com.restaurant.restaurantapp.controller;

import com.restaurant.restaurantapp.model.Client;
import com.restaurant.restaurantapp.model.Reservation;
import com.restaurant.restaurantapp.repository.ClientRepository;
import com.restaurant.restaurantapp.repository.ReservationRepository;
import com.restaurant.restaurantapp.repository.OrderRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/stats")
    public Map<String, Object> getAdminStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalClients", clientRepository.count());
        stats.put("totalReservations", reservationRepository.count());
        stats.put("confirmed", reservationRepository.countByStatus("CONFIRMED"));
        stats.put("cancelled", reservationRepository.countByStatus("CANCELLED"));
        stats.put("totalOrders", orderRepository.count());
        return stats;
    }

    // ✅ Exportar reservas como CSV
    @GetMapping("/export-reservations")
    public void exportReservationsCSV(@RequestHeader("email") String email, HttpServletResponse response) {
        Optional<Client> client = clientRepository.findByEmail(email);
        if (client.isEmpty() || !"ADMIN".equals(client.get().getRole())) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            return;
        }

        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=reservations.csv");

        try (PrintWriter writer = response.getWriter()) {
            writer.println("Reservation ID,Client Name,Date,People,Table Number,Status");

            List<Reservation> reservations = reservationRepository.findAll();
            for (Reservation r : reservations) {
                String clientName = r.getClient() != null ? r.getClient().getFirstName() + " " + r.getClient().getLastName() : "N/A";
                String date = r.getReservationDate() != null ? r.getReservationDate().toString() : "N/A";
                String table = r.getTable() != null ? String.valueOf(r.getTable().getTableNumber()) : "N/A";
                writer.printf("%d,%s,%s,%d,%s,%s%n",
                        r.getId(), clientName, date, r.getNumberOfPeople(), table, r.getStatus());
            }

            writer.flush();
        } catch (IOException e) {
            throw new RuntimeException("Error writing CSV", e);
        }
    }
}


