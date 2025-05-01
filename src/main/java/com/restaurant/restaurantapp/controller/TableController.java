package com.restaurant.restaurantapp.controller;

import com.restaurant.restaurantapp.model.RestaurantTable;
import com.restaurant.restaurantapp.repository.RestaurantTableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
@CrossOrigin(origins = "*")
public class TableController {

    @Autowired
    private RestaurantTableRepository tableRepository;

    @GetMapping
    public List<RestaurantTable> getAllTables() {
        return tableRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<RestaurantTable> createTable(@RequestBody RestaurantTable table) {
        return ResponseEntity.ok(tableRepository.save(table));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RestaurantTable> updateTable(@PathVariable Long id, @RequestBody RestaurantTable updated) {
        return tableRepository.findById(id)
                .map(table -> {
                    table.setTableNumber(updated.getTableNumber());
                    table.setSeats(updated.getSeats());
                    return ResponseEntity.ok(tableRepository.save(table));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTable(@PathVariable Long id) {
        tableRepository.deleteById(id);
        return ResponseEntity.ok("Table deleted successfully");
    }
}
