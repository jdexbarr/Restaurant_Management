package com.restaurant.restaurantapp.dto;

public class TableAvailabilityDTO {
    private Long tableId;
    private int tableNumber;
    private int seats;
    private boolean occupied;

    public TableAvailabilityDTO(Long tableId, int tableNumber, int seats, boolean occupied) {
        this.tableId = tableId;
        this.tableNumber = tableNumber;
        this.seats = seats;
        this.occupied = occupied;
    }

    public Long getTableId() {
        return tableId;
    }

    public int getTableNumber() {
        return tableNumber;
    }

    public int getSeats() {
        return seats;
    }

    public boolean isOccupied() {
        return occupied;
    }
}
