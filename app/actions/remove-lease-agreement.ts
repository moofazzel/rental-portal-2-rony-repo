"use server";

import { getToken } from "@/lib/utils";
import crypto from "crypto";

export async function removeLeaseAgreement(leaseId: string) {
  try {
    // Get authentication token
    const token = await getToken();
    if (!token) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    if (!leaseId) {
      return {
        success: false,
        message: "Lease ID is required",
      };
    }

    // Get the lease data to find the Cloudinary URL
    const leaseResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/leases/${leaseId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!leaseResponse.ok) {
      return {
        success: false,
        message: "Failed to fetch lease data",
      };
    }

    const leaseData = await leaseResponse.json();
    const leaseAgreementUrl = leaseData.lease?.leaseAgreement;

    if (!leaseAgreementUrl) {
      return {
        success: false,
        message: "No lease agreement found",
      };
    }

    // Extract public ID from Cloudinary URL
    const urlParts = leaseAgreementUrl.split("/");
    const publicIdWithVersion = urlParts.slice(-2).join("/"); // Get the last two parts
    const publicId = publicIdWithVersion.split(".")[0]; // Remove file extension

    // Delete from Cloudinary
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return {
        success: false,
        message: "Cloudinary configuration missing",
      };
    }

    // Generate signature for Cloudinary deletion
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = crypto
      .createHash("sha1")
      .update(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
      .digest("hex");

    // Delete from Cloudinary
    const cloudinaryDeleteUrl = `https://api.cloudinary.com/v1_1/${cloudName}/delete_by_token`;
    const deleteFormData = new FormData();
    deleteFormData.append("public_id", publicId);
    deleteFormData.append("timestamp", timestamp);
    deleteFormData.append("api_key", apiKey);
    deleteFormData.append("signature", signature);

    const cloudinaryResponse = await fetch(cloudinaryDeleteUrl, {
      method: "POST",
      body: deleteFormData,
    });

    if (!cloudinaryResponse.ok) {
      console.error(
        "Cloudinary deletion failed:",
        await cloudinaryResponse.text()
      );
      // Continue with backend deletion even if Cloudinary fails
    }

    // Remove from backend
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/leases/${leaseId}/remove-agreement`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!backendResponse.ok) {
      return {
        success: false,
        message: "Failed to remove lease agreement from backend",
      };
    }

    const backendResult = await backendResponse.json();

    return {
      success: true,
      message: "Lease agreement removed successfully",
      data: backendResult,
    };
  } catch (error) {
    console.error("Error removing lease agreement:", error);
    return {
      success: false,
      message: "Internal server error",
    };
  }
}
