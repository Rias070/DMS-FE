// AccountController.cs
GET    /api/Accounts              // List all users
GET    /api/Accounts/{id}         // Get user by ID  
PUT    /api/Accounts/{id}         // Update user
DELETE /api/Accounts/{id}         // Delete user
PUT    /api/Accounts/{id}/activate    // Activate user
PUT    /api/Accounts/{id}/deactivate  // Deactivate user
PUT    /api/Accounts/{id}/roles   // Update user roles
GET    /api/Accounts/dealer/{id}  // Get users by dealer