package com.restaurant.restaurantapp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "restaurant_table")
public class RestaurantTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "table_number", nullable = false, unique = true)
    private int tableNumber;

    @Column(nullable = false)
    private int seats;

    public RestaurantTable() {}

    public RestaurantTable(int tableNumber, int seats) {
        this.tableNumber = tableNumber;
        this.seats = seats;
    }

    public Long getId() {
        return id;
    }

    // 👇 Setter agregado para poder asignar el ID manualmente
    public void setId(Long id) {
        this.id = id;
    }

    public int getTableNumber() {
        return tableNumber;
    }

    public void setTableNumber(int tableNumber) {
        this.tableNumber = tableNumber;
    }

    public int getSeats() {
        return seats;
    }

    public void setSeats(int seats) {
        this.seats = seats;
    }
}
