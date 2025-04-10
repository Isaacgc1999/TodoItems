# TodoList Application

This project is a full-stack TodoList application composed of three main parts:

1.  **TodoItems (Console Application):** A command-line interface for interacting with Todo items. This application demonstrates basic CRUD operations and provides a way to manage tasks directly from the terminal.

2.  **TodoServer (WebApi):** An ASP.NET Core Web API that serves as the backend for managing Todo items. It exposes endpoints for creating, reading, updating, and deleting tasks, as well as managing their progress. This API is the core of the application's data management and provides the necessary functionality for the frontend.

3.  **Frontend:** A user interface build with angular that allows users to interact with the TodoList application through a web browser. This frontend consumes the API provided by `TodoServer` to display and manage tasks.

## Testing

Currently, **all unit tests for this project are located within the `TodoServer` (WebApi) project.** This includes tests for:

* **Repositories:** Ensuring the data access layer interacts correctly with the underlying data store.
* **Services:** Verifying the business logic and rules of the application are implemented correctly.
* **Controllers:** Testing the API endpoints to ensure they handle requests appropriately, return the correct responses, and interact with the service layer as expected.

**Note:** While the current testing strategy focuses on the backend API, it's important to consider adding tests for the `TodoItems` console application and the Frontend in the future to ensure the complete application functions as intended.

## Getting Started

Instructions on how to run each part of the application will vary depending on the specific technologies used. Please refer to the individual README files (if they exist) within the `TodoItems`, `TodoServer`, and `Frontend` directories for detailed setup and execution instructions.

**Typically, you might need to:**

* **TodoServer (WebApi):**
    * Navigate to the `TodoServer` directory in your terminal.
    * Run the application using the .NET CLI (e.g., `dotnet run`).
    * Ensure any required database or other dependencies are configured.

* **Frontend:**
    * Navigate to the `Frontend` directory in your terminal.
    * Install dependencies using a package manager (e.g., `npm install` or `yarn install`).
    * Start the development server (e.g., `npm start` or `yarn start`).
    * The frontend application will likely connect to the API running on the `TodoServer`.

* **TodoItems (Console Application):**
    * Navigate to the `TodoItems` directory in your terminal.
    * Build the application using the .NET CLI (e.g., `dotnet build`).
    * Run the executable (e.g., `dotnet run` or the built executable in the `bin` directory).
    * This application might interact directly with a data store or potentially with the `TodoServer` API.
