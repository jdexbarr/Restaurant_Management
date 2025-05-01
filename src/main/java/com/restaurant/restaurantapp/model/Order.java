package com.restaurant.restaurantapp.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders") // "order" es palabra reservada en SQL
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime orderDate;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference // ✅ Para serializar correctamente sin ciclos
    private List<OrderItem> items;

    private String status; // ej: PENDING, COMPLETED, CANCELLED

    public Order() {}

    public Order(LocalDateTime orderDate, Client client, List<OrderItem> items, String status) {
        this.orderDate = orderDate;
        this.client = client;
        this.items = items;
        this.status = status;
    }

    public Long getId() { return id; }
    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }

    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }

    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}

