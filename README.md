# Project Netra (Amogh Financial News and Investment Dashboard)

This project is a financial news and investment dashboard. It provides a benchmark-level test plan and supporting artifacts that meet or exceed the standards of Apple and Google projects.

## Getting Started

### Prerequisites

Make sure you have Node.js version 18 or higher installed.

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Install the dependencies:
    ```bash
    npm ci
    ```

### Environment Variables

Create a `.env` file in the `backend` directory and add the following environment variables:

```
RABBITMQ_URL=amqp://localhost
JWT_SECRET=supersecretjwtkey
```

### Running the Application

To run the application in development mode, use the following command:

```bash
npm run dev
```

This will start the Vite development server.

### Running the Next.js Application

To run the Next.js application, use the following commands:

```bash
npm run dev:next
```

This will start the Next.js development server on port 3030.

## Testing

### Unit Tests

To run the unit tests, use the following command:

```bash
npm run test
```

This will run the tests using Vitest.

### Test Coverage

To run the tests and see the coverage report, use the following command:

```bash
npm run test:ci
```

### End-to-End Tests

To run the end-to-end tests, use the following command:

```bash
npm run e2e
```

This will run the Playwright tests.

## Linting

To lint the code, use the following command:

```bash
npm run lint
```

## Building for Production

To build the application for production, use the following command:

```bash
npm run build
```