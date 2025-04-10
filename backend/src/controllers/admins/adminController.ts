import { Request, Response } from "express";
import { adminService } from "../../services/adminService.js";
import {
  AdminLoginSchema,
  AdminRegistrationSchema,
  AdminUpdateSchema,
} from "./authSchema.js";
import {
  createErrorResponse,
  createSuccessResponse,
} from "../../utils/responseUtils.js";

export const registerAdmin = async (req: Request, res: Response) => {
  try {
    const validatedData = AdminRegistrationSchema.parse(req.body);

    // Check if admin already exists
    const existingAdmin = await adminService.findAdminByEmail(
      validatedData.email
    );
    if (existingAdmin) {
      return createErrorResponse(res, 400, "Admin already exists");
    }

    // Create new admin
    const admin = await adminService.createAdmin(validatedData);

    // Generate tokens
    const { accessToken, refreshToken } = adminService.generateTokens(
      admin._id.toString(),
      admin.role
    );

    // Update refresh token in DB
    await adminService.updateRefreshToken(admin._id.toString(), refreshToken);

    // Set refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return success response
    createSuccessResponse(res, 201, "Admin created successfully", {
      admin: {
        id: admin._id,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
        permissions: admin.permissions,
      },
      accessToken,
    });
  } catch (error) {
    console.error("Admin registration error:", error);
    createErrorResponse(res, 500, "Failed to register admin");
  }
};

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = AdminLoginSchema.parse(req.body);

    // Find admin by email
    const admin = await adminService.findAdminByEmail(email);
    if (!admin) {
      return createErrorResponse(res, 401, "Invalid credentials");
    }

    // Compare passwords
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return createErrorResponse(res, 401, "Invalid credentials");
    }

    // Generate tokens
    const { accessToken, refreshToken } = adminService.generateTokens(
      admin._id.toString(),
      admin.role
    );

    // Update refresh token in DB
    await adminService.updateRefreshToken(admin._id.toString(), refreshToken);

    // Set refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Return success response
    createSuccessResponse(res, 200, "Login successful", {
      admin: {
        id: admin._id,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
        permissions: admin.permissions,
      },
      accessToken,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    createErrorResponse(res, 500, "Failed to login admin");
  }
};

export const getAdminProfile = async (req: Request, res: Response) => {
  try {
    const admin = await adminService.findAdminById(req.user.id);
    if (!admin) {
      return createErrorResponse(res, 404, "Admin not found");
    }

    createSuccessResponse(res, 200, "Admin profile retrieved", {
      admin: {
        id: admin._id,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
        permissions: admin.permissions,
      },
    });
  } catch (error) {
    console.error("Get admin profile error:", error);
    createErrorResponse(res, 500, "Failed to get admin profile");
  }
};

export const updateAdmin = async (req: Request, res: Response) => {
  try {
    const validatedData = AdminUpdateSchema.parse(req.body);
    const admin = await adminService.updateAdmin(req.user.id, validatedData);

    if (!admin) {
      return createErrorResponse(res, 404, "Admin not found");
    }

    createSuccessResponse(res, 200, "Admin updated successfully", {
      admin: {
        id: admin._id,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
        permissions: admin.permissions,
      },
    });
  } catch (error) {
    console.error("Update admin error:", error);
    createErrorResponse(res, 500, "Failed to update admin");
  }
};
