package com.restaurant.restaurantapp.service;

import com.restaurant.restaurantapp.model.Client;
import com.restaurant.restaurantapp.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ✅ Registro de cliente con encriptación de contraseña
    public Client registerClient(Client client) {
        if (client.getPassword() == null || client.getPassword().length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters.");
        }

        String encryptedPassword = passwordEncoder.encode(client.getPassword());
        client.setPassword(encryptedPassword);
        return clientRepository.save(client);
    }

    // ✅ Guardar cambios en cliente
    public Client saveClient(Client client) {
        return clientRepository.save(client);
    }

    // ✅ Buscar cliente por email
    public Optional<Client> findByEmail(String email) {
        return clientRepository.findByEmail(email);
    }

    // ✅ Buscar cliente por ID
    public Optional<Client> findById(Long id) {
        return clientRepository.findById(id);
    }

    // ✅ Obtener todos los clientes
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    // ✅ Login con comparación segura usando bcrypt
    public Optional<Client> login(String email, String password) {
        Optional<Client> clientOptional = clientRepository.findByEmail(email);

        if (clientOptional.isPresent()) {
            Client client = clientOptional.get();
            if (passwordEncoder.matches(password, client.getPassword())) {
                return Optional.of(client);
            }
        }
        return Optional.empty();
    }
}

