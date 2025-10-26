# E-Commerce Backend
The purpose of the backend service is to offer business logic and data persistence for a E-Commerce app, applying best security practices.

## API
In this section, you will find the available endpoints with their important details.

Reference of roles;
- A: Admin
- U: User

|URI                 |HTTP Method|Description            |Role |Tested|
|--------------------|-----------|-----------------------|-----|------|
|**CATEGORIAS**|
|api/categorias      |GET        |Get all categories     |A, U |  ❌  |
|api/categorias/{id} |GET        |Get a category by ID   |A, U |  ❌  |
|api/categorias      |POST       |Create a new category  |A    |  ❌  |
|api/categorias/{id} |PUT        |Update a category by ID|A    |  ❌  |
|api/categorias/{id} |DELETE     |Delete a category by ID|A    |  ❌  |
|**PRODUCTOS**|
|api/productos      |GET        |Get all products        |A, U |  ❌  |
|api/productos/{id} |GET        |Get a product by ID     |A, U |  ❌  |
|api/productos      |POST       |Create a new product    |A    |  ❌  |
|api/productos/{id} |PUT        |Update a product by ID  |A    |  ❌  |
|api/productos/{id} |DELETE     |Delete a product by ID  |A    |  ❌  |
|api/productos/{id}/categoria|GET |??   | - |  ❌  |
|api/productos/{id}/categoria/{id}|DELETE|?? | - |  ❌  |
