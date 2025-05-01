package com.restaurant.restaurantapp.service;

import com.restaurant.restaurantapp.model.MenuItem;
import com.restaurant.restaurantapp.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MenuItemService {

    @Autowired
    private MenuItemRepository menuItemRepository;

    // Create or update a menu item
    public MenuItem saveMenuItem(MenuItem menuItem) {
        return menuItemRepository.save(menuItem);
    }

    // Get all menu items
    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }

    // Get a single menu item by ID
    public Optional<MenuItem> getMenuItemById(Long id) {
        return menuItemRepository.findById(id);
    }

    // Delete a menu item by ID
    public void deleteMenuItem(Long id) {
        menuItemRepository.deleteById(id);
    }
}
