package com.restaurant.restaurantapp.service;

import com.restaurant.restaurantapp.model.Order;
import com.restaurant.restaurantapp.model.OrderItem;
import com.restaurant.restaurantapp.repository.OrderItemRepository;
import com.restaurant.restaurantapp.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    public Order createOrder(Order order) {
        order.setOrderDate(LocalDateTime.now());
        order.getItems().forEach(item -> item.setOrder(order));
        return orderRepository.save(order);
    }

    public List<Order> getOrdersByClientId(Long clientId) {
        return orderRepository.findByClientId(clientId);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public void deleteOrder(Long orderId) {
        orderRepository.deleteById(orderId);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    public Order updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return orderRepository.save(order);
    }

    public Order updateOrderDetails(Long id, Order updatedOrder) {
        Order existingOrder = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        existingOrder.setStatus(updatedOrder.getStatus());
        existingOrder.setOrderDate(updatedOrder.getOrderDate() != null ? updatedOrder.getOrderDate() : LocalDateTime.now());

        orderItemRepository.deleteAll(existingOrder.getItems());

        updatedOrder.getItems().forEach(item -> item.setOrder(existingOrder));
        existingOrder.setItems(updatedOrder.getItems());

        return orderRepository.save(existingOrder);
    }

    public Order simulatePayment(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus("COMPLETED");
        return orderRepository.save(order);
    }
}


