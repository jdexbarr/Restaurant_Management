package com.restaurant.restaurantapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;

    @ManyToOne
    @JoinColumn(name = "table_id")
    private RestaurantTable table;

    private LocalDateTime reservationDate;
    private int numberOfPeople;
    private String status; // CONFIRMED, CANCELLED, etc.

    public Reservation() {}

    public Reservation(Client client, RestaurantTable table, LocalDateTime reservationDate, int numberOfPeople, String status) {
        this.client = client;
        this.table = table;
        this.reservationDate = reservationDate;
        this.numberOfPeople = numberOfPeople;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public RestaurantTable getTable() {
        return table;
    }

    public void setTable(RestaurantTable table) {
        this.table = table;
    }

    public Long getTableId() {
        return table != null ? table.getId() : null;
    }

    public void setTableId(Long tableId) {
        this.table = new RestaurantTable();
        this.table.setId(tableId);
    }

    public LocalDateTime getReservationDate() {
        return reservationDate;
    }

    public void setReservationDate(LocalDateTime reservationDate) {
        this.reservationDate = reservationDate;
    }

    public int getNumberOfPeople() {
        return numberOfPeople;
    }

    public void setNumberOfPeople(int numberOfPeople) {
        this.numberOfPeople = numberOfPeople;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

