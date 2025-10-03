# Dokploy Environment Variables Setup

## Required Environment Variable

Add this to your Dokploy application settings:

**Name:** `VITE_RAWG_API_KEY`  
**Value:** `5dfbe1e4a94847cf94ce53b04b84f90f`

## Important Notes

1. **Build-time variable**: Vite embeds environment variables during the build process, not at runtime.

2. **In Dokploy**: Make sure the environment variable is set BEFORE deploying. Dokploy should automatically pass it as a build argument to Docker.

3. **Docker build command** (if building manually):

   ```bash
   docker build --build-arg VITE_RAWG_API_KEY=5dfbe1e4a94847cf94ce53b04b84f90f -t buildcores-benchmark .
   ```

4. **Verification**: After deployment, check the browser console for:
   ```
   [RAWG] API Key present: true
   [RAWG] Fetching: https://api.rawg.io/api/games/...
   ```

## Troubleshooting

If images still don't load after deployment:

- Verify the env var is set in Dokploy settings
- Trigger a fresh rebuild (not just restart)
- Check browser console for RAWG API logs
- Ensure no CORS issues (RAWG API should allow all origins)
