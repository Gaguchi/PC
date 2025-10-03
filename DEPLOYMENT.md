# Dokploy Environment Variables Setup

## ⚠️ CRITICAL: Build Arguments Configuration

Dokploy needs to pass environment variables as **build arguments** to Docker during the build process.

### Step 1: Add Environment Variable in Dokploy

1. Go to your application in Dokploy
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variable:

   **Name:** `VITE_RAWG_API_KEY`  
   **Value:** `5dfbe1e4a94847cf94ce53b04b84f90f`  
   **Build Time:** ✅ **ENABLE THIS** (critical!)

### Step 2: Configure Build Arguments

Dokploy must pass the environment variable to Docker's `--build-arg` flag. Check your Dokploy build settings:

**Option A: If Dokploy has a "Build Arguments" section:**

- Add: `VITE_RAWG_API_KEY=${VITE_RAWG_API_KEY}`

**Option B: If using custom build command:**

```bash
docker build --build-arg VITE_RAWG_API_KEY=$VITE_RAWG_API_KEY -t buildcores-benchmark .
```

**Option C: If Dokploy doesn't auto-convert env vars to build args:**
You may need to modify the Dockerfile to use a default value or create a build script.

### Step 3: Trigger Fresh Rebuild

- Don't just restart the container
- Trigger a **full rebuild** from source
- Clear any build cache if available

## Verification

After redeployment, open the browser console on your deployed URL and check for:

✅ **Success:**

```
[RAWG] API Key present: true
[RAWG] API Key value: 5dfbe1e4...
[RAWG] Fetching: https://api.rawg.io/api/games/...
[RAWG] Response status: 200
[RAWG] Background image URL: https://media.rawg.io/...
```

❌ **Failure:**

```
VITE_RAWG_API_KEY not set. Game box art will not load.
```

## Important Notes

1. **Build-time variable**: Vite embeds environment variables during `npm run build`, not at container runtime.

2. **The `VITE_` prefix is required** for Vite to expose the variable to the client-side code.

3. **Environment variables are baked into the JavaScript bundle** during build. Changing them requires a rebuild.

## Manual Docker Build (for testing)

If Dokploy configuration is unclear, test the build locally:

```bash
docker build --build-arg VITE_RAWG_API_KEY=5dfbe1e4a94847cf94ce53b04b84f90f -t buildcores-benchmark .
docker run -p 8080:80 buildcores-benchmark
```

Then visit `http://localhost:8080` and check the console.

## Troubleshooting Dokploy

If the environment variable still doesn't work:

1. **Check Dokploy documentation** for how to pass build arguments
2. **Alternative approach**: Create a `.env.production` file committed to the repo (not recommended for secrets, but works for API keys)
3. **Contact Dokploy support** with this question: "How do I pass environment variables as Docker build arguments?"
