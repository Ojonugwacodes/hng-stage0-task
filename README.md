<<<<<<< HEAD
# Gender Classify API

A simple REST API that predicts the gender associated with a given name, powered by the [Genderize.io](https://genderize.io) service. It returns a gender prediction along with probability, sample size, and a confidence indicator.

## Features

- Gender prediction from a name via a single endpoint
- Confidence scoring based on probability and sample size
- Interactive API docs via Swagger UI
- CORS enabled

## Prerequisites

- [Node.js](https://nodejs.org) (v16 or later recommended)
- npm

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/Ojonugwacodes/hng-stage0-task.git
   cd gender-classify-api
   ```

2. **Install dependencies**

   ```bash
   npm install express cors axios swagger-ui-express yamljs
   ```

3. **Start the server**

   ```bash
   # development (auto-reload)
   npm run dev

   # production
   npm start
   ```

   The server runs on `http://localhost:3000` by default. Set the `PORT` environment variable to change it.

## API Documentation

Interactive Swagger docs are available at `/api-docs` once the server is running.

### `GET /api/classify`

Classify the gender of a name.

**Query Parameters**

| Parameter | Type   | Required | Description          |
|-----------|--------|----------|----------------------|
| `name`    | string | Yes      | The name to classify |

**Example Request**

```bash
curl "http://localhost:3000/api/classify?name=alice"
```

**Example Response** (`200 OK`)

```json
{
  "status": "success",
  "data": {
    "name": "alice",
    "gender": "female",
    "probability": 0.98,
    "sample_size": 5765,
    "is_confident": true,
    "processed_at": "2026-04-13T12:00:00.000Z"
  }
}
```

A prediction is marked as **confident** when the probability is >= 0.7 and the sample size is >= 100.

### Error Responses

| Status | Reason                                        |
|--------|-----------------------------------------------|
| `400`  | Missing or empty `name` query parameter       |
| `422`  | `name` is not a string                        |
| `500`  | Internal server error                         |
| `502`  | Failed to reach the Genderize.io upstream API |

All errors return:

```json
{
  "status": "error",
  "message": "..."
}
```

## Tech Stack

- [Express](https://expressjs.com) v5
- [Axios](https://axios-http.com) for upstream HTTP requests
- [Swagger UI Express](https://www.npmjs.com/package/swagger-ui-express) for interactive API docs
- [Genderize.io](https://genderize.io) as the prediction source

## License

ISC
