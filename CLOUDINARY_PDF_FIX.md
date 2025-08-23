# Cloudinary PDF Upload Fix

## Problem Description

The error `"Customer is marked as untrusted"` with code `"show_original_customer_untrusted"` occurs when trying to access PDF files uploaded to Cloudinary. This typically happens when:

1. **Free Cloudinary Account**: Free accounts have restrictions on file access
2. **Untrusted Content**: PDFs are being treated as potentially unsafe content
3. **Missing Access Configuration**: Files aren't properly configured for public access

## Solutions Implemented

### 1. Updated Upload Configuration

**File**: `app/actions/cloudinary-upload.ts`

- Added `access_mode: "public"` to ensure files are publicly accessible
- Added `flags: "trusted"` to mark files as trusted content
- Implemented server-side SDK upload for PDFs instead of direct API calls
- Added proper error handling and fallback mechanisms

### 2. Enhanced Cloudinary Configuration

**File**: `lib/cloudinary.ts` (Server-side)
**File**: `lib/cloudinary-client.ts` (Client-side)

- Updated upload settings to include `access_mode: "public"`
- Added `flags: "trusted"` to all document uploads
- Created client-side utilities for URL generation without SDK
- Added `checkPdfAccessibility()` function to verify URL access
- Separated server and client concerns to avoid bundling issues

### 3. Improved Tenant Edit Modal

**File**: `app/(pages)/(root)/admin/tenants/(components)/TenantEditModal.tsx`

- Added secure URL generation after upload
- Implemented accessibility checking
- Added fallback to original URL if secure URL fails

### 4. Next.js Configuration Fix

**File**: `next.config.ts`

- Added webpack configuration to prevent client-side bundling of Node.js modules
- Configured fallbacks for fs, path, and crypto modules
- Ensures Cloudinary SDK only runs on the server side

## Key Changes Made

### Upload Action Changes

```typescript
// For PDFs, use signed upload with proper access settings
if (resourceType === "raw") {
  // Build signature for raw uploads
  const stringToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto
    .createHash("sha1")
    .update(stringToSign)
    .digest("hex");

  const serverForm = new FormData();
  serverForm.append("file", file);
  serverForm.append("folder", folder);
  serverForm.append("timestamp", timestamp);
  serverForm.append("api_key", apiKey);
  serverForm.append("signature", signature);
  serverForm.append("resource_type", "raw");
  serverForm.append("format", "pdf");
  serverForm.append("access_mode", "public");
  serverForm.append("flags", "trusted");
  serverForm.append("allowed_formats", "pdf");

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`;
  // ... rest of the upload logic
}
```

### Secure URL Generation

```typescript
// Client-side URL generation (no SDK required)
export function getSecurePdfUrl(publicId: string, cloudName?: string): string {
  const cloud = cloudName || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloud) {
    console.warn("Cloudinary cloud name not found");
    return publicId; // Return the public ID as fallback
  }

  // Generate a secure URL manually
  return `https://res.cloudinary.com/${cloud}/raw/upload/fl_trusted,fl_public/${publicId}.pdf`;
}
```

## Additional Troubleshooting Steps

### 1. Check Cloudinary Account Settings

1. Log into your Cloudinary dashboard
2. Go to Settings > Upload
3. Ensure "Upload presets" are configured for public access
4. Check if your account has any restrictions

### 2. Environment Variables

Ensure these environment variables are properly set:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Cloudinary Plan Limitations

If you're on a free plan, consider:

- Upgrading to a paid plan for better access control
- Using signed URLs for temporary access
- Implementing a proxy server for file access

### 4. Alternative Solutions

If the issue persists, consider:

1. **Using a Different Storage Service**: AWS S3, Google Cloud Storage
2. **Implementing a Proxy**: Create an API endpoint that serves files
3. **Local Storage**: Store files locally with proper access controls

## Testing the Fix

1. Upload a PDF file through the tenant edit modal
2. Check if the file is accessible via the generated URL
3. Verify the file opens correctly in a browser
4. Test downloading the file

## Monitoring

The system now includes:

- Automatic accessibility checking
- Fallback URL generation
- Error logging for debugging
- Success/failure notifications

## Future Improvements

1. **Caching**: Implement URL caching to improve performance
2. **Retry Logic**: Add automatic retry for failed uploads
3. **File Validation**: Enhanced file type and size validation
4. **Access Logging**: Track file access patterns for security
