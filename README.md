# E-Commerce Backend
The purpose of the backend service is to offer business logic and data persistence for a E-Commerce app, applying best security practices.

## Endpoints
The next table shows all available endpoints

|URI                 |HTTP Method|Description            |Role                   |Tested|
|--------------------|-----------|-----------------------|-----------------------|------|
|api/categorias      |GET        |Get all categories     |Administrador, Usuario |  ❌  |
|api/categorias/{id} |GET        |Get a category by ID   |Administrador, Usuario |  ❌  |
|api/categorias      |POST       |Create a new category  |Administrador          |  ❌  |
|api/categorias/{id} |PUT        |Update a category by ID|Administrador          |  ❌  |
|api/categorias/{id} |DELETE     |Delete a category by ID|Administrador          |  ❌  |
||||||
||||||
