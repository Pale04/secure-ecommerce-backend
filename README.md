# E-Commerce Backend
The purpose of the backend service is to offer business logic and data persistence for a E-Commerce app, applying best security practices.

## API
In this section, you will find the available endpoints with their important details.

Reference of roles;
- A: Admin
- U: User

|URI                 |HTTP Method|Description            |Role |Tested|
|--------------------|-----------|-----------------------|-----|------|
|**AUTH**|
|api/auth            |POST       |Generate JWT token     | -   |  ✅  |
|api/auth/tiempo     |POST       |Get remaining time of token| -   |  ✅  |
|**CATEGORIAS**|
|api/categorias      |GET        |Get all categories     |A, U |  ❌  |
|api/categorias/{id} |GET        |Get a category by ID   |A, U |  ❌  |
|api/categorias      |POST       |Create a new category  |A    |  ❌  |
|api/categorias/{id} |PUT        |Update a category by ID|A    |  ❌  |
|api/categorias/{id} |DELETE     |Delete a category by ID|A    |  ❌  |
|**PRODUCTOS**|
|api/productos       |GET        |Get all products       |A, U |  ❌  |
|api/productos/{id}  |GET        |Get a product by ID    |A, U |  ❌  |
|api/productos       |POST       |Create a new product   |A    |  ❌  |
|api/productos/{id}  |PUT        |Update a product by ID |A    |  ❌  |
|api/productos/{id}  |DELETE     |Delete a product by ID |A    |  ❌  |
|api/productos/{id}/categoria|GET |??                    | -   |  ❌  |
|api/productos/{id}/categoria/{id}|DELETE|??             | -   |  ❌  |
|**ARCHIVOS**|
|api/archivos        |GET        |Get all files          |A    |  ✅  |
|api/archivos/{id}/detalle|GET   |Get details of a file  |A    |  ✅  |
|api/archivos/{id}   |GET        |Get a file by ID       |A    |  ✅  |
|api/archivos        |POST       |Upload a new file      |A    |  ✅  |
|api/archivos/{id}   |PUT        |Update a file by ID    |A    |  ✅  |
|api/archivos/{id}   |DELETE     |Delete a file by ID    |A    |  ✅  |
|**USUARIOS**|
|api/usuarios        |GET        |Get all users          |A    |  ❌  |
|api/usuarios/{email}|GET        |Get a user by email    |A    |  ❌  |
|api/usuarios        |POST       |Create a new user      |A    |  ❌  |
|api/usuarios/{email}|PUT        |Update a user by email |A    |  ❌  |
|api/usuarios/{email}|DELETE     |Delete a user by email |A    |  ❌  |
|**ROLES**|
|api/roles           |GET        |Get all roles          |A    |  ❌  |
|**BITACORA**|
|api/bitacora        |GET        |Get all logs           |A    |  ❌  |

## Pending Tasks
- [ ] Test all endpoints
- [ ] Implement support for shopping cart and orders funcionality
- [ ] Implement stronger validation in controllers

## Security Practices
- Validation of data types, lengths, and formats
- Authentication and password management
- Authorization (role-based access control)
- Cryptography practices
- Error handling and logging
- Threat modeling