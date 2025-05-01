package com.restaurant.restaurantapp.controller;

import com.restaurant.restaurantapp.model.MenuItem;
import com.restaurant.restaurantapp.service.MenuItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/menuitems")
@CrossOrigin(origins = "*")
public class MenuItemController {

    @Autowired
    private MenuItemService menuItemService;

    // 🔥 Crear o actualizar (JSON simple)
    @PostMapping
    public ResponseEntity<MenuItem> createOrUpdateMenuItem(@RequestBody MenuItem menuItem) {
        MenuItem savedItem = menuItemService.saveMenuItem(menuItem);
        return ResponseEntity.ok(savedItem);
    }

    // 🔥 Crear con imagen (formulario con archivo)
    @PostMapping("/upload")
    public ResponseEntity<?> uploadMenuItem(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") double price,
            @RequestParam("available") boolean available,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        try {
            MenuItem item = new MenuItem();
            item.setName(name);
            item.setDescription(description);
            item.setPrice(price);
            item.setAvailable(available);

            // 🔥 Guardar imagen si se provee
            if (image != null && !image.isEmpty()) {
                String filename = UUID.randomUUID() + "_" + image.getOriginalFilename();
                String uploadDir = "uploads/menu/";
                Path uploadPath = Paths.get(uploadDir);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                Path filePath = uploadPath.resolve(filename);
                Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                item.setImageUrl("/" + uploadDir + filename); // para acceder vía HTTP
            }

            MenuItem saved = menuItemService.saveMenuItem(item);
            return ResponseEntity.ok(saved);

        } catch (IOException e) {
            return ResponseEntity.status(500).body("Image upload failed: " + e.getMessage());
        }
    }

    // Obtener todos
    @GetMapping
    public ResponseEntity<List<MenuItem>> getAllMenuItems() {
        return ResponseEntity.ok(menuItemService.getAllMenuItems());
    }

    // Obtener uno por ID
    @GetMapping("/{id}")
    public ResponseEntity<MenuItem> getMenuItemById(@PathVariable Long id) {
        Optional<MenuItem> item = menuItemService.getMenuItemById(id);
        return item.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Eliminar
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMenuItem(@PathVariable Long id) {
        menuItemService.deleteMenuItem(id);
        return ResponseEntity.ok("Menu item deleted successfully");
    }
}
