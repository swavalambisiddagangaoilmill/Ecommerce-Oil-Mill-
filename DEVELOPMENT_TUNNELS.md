# Development Tunnels

This project uses one backend env file only: `server/.env`.

The frontend always calls same-origin `/api`. During local and tunnel development, Vite proxies `/api` to the backend.

## Localhost

`server/.env`:

```bash
PORT=5000
CLIENT_URL=http://localhost:5173
CLIENT_URLS=http://localhost:5173
BACKEND_PUBLIC_URL=
```

Run the backend on `http://localhost:5000` and the frontend on `http://localhost:5173`.

## VS Code Dev Tunnels

Expose both ports:

- Frontend port `5173`
- Backend port `5000`

Set the backend tunnel URL in the single backend env file:

```bash
BACKEND_PUBLIC_URL=https://your-backend-5000-tunnel.devtunnels.ms
```

Open the frontend tunnel URL. Frontend requests still go to `/api`; Vite forwards them to `BACKEND_PUBLIC_URL` when it is set, otherwise to `http://localhost:5000`.

Development CORS accepts localhost, `127.0.0.1`, and VS Code Dev Tunnel origins with credentials enabled. Production still uses only the explicit `CLIENT_URLS` whitelist.