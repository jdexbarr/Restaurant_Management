package com.restaurant.restaurantapp.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int quantity;

    @ManyToOne
    @JoinColumn(name = "menu_item_id")
    private MenuItem menuItem;

    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonBackReference // 🔥 Importante para evitar ciclo infinito
    private Order order;

    public OrderItem() {}

    public OrderItem(int quantity, MenuItem menuItem, Order order) {
        this.quantity = quantity;
        this.menuItem = menuItem;
        this.order = order;
    }

    public Long getId() { return id; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public MenuItem getMenuItem() { return menuItem; }
    public void setMenuItem(MenuItem menuItem) { this.menuItem = menuItem; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }
}

