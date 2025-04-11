/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/adminService.ts
import Admin from "../models/adminModel.js";
import jwt from "jsonwebtoken";
import { envConfig } from "../config/envValidator.js";

class AdminService {
  async createAdmin(adminData: any) {
    return Admin.create(adminData);
  }

  async findAdminByEmail(email: string) {
    return Admin.findOne({ email });
  }

  async findAdminById(id: string) {
    return Admin.findById(id);
  }

  async updateAdmin(id: string, updateData: any) {
    return Admin.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteAdmin(id: string) {
    return Admin.findByIdAndDelete(id);
  }

  generateTokens(adminId: string, role: string) {
    const accessToken = jwt.sign(
      { id: adminId, role },
      envConfig.accessToken, // Using ACCESS_SECRET_TOKEN from env
      { expiresIn: "15m" } // You can make this configurable if needed
    );

    const refreshToken = jwt.sign(
      { id: adminId, role },
      envConfig.refreshToken, // Using REFRESH_TOKEN_SECRET from env
      { expiresIn: "7d" } // You can make this configurable if needed
    );

    return { accessToken, refreshToken };
  }

  async updateRefreshToken(adminId: string, refreshToken: string) {
    return Admin.findByIdAndUpdate(adminId, { refreshToken }, { new: true });
  }

  async grantPermissions(adminId: string, permissions: string[]) {
    return Admin.findByIdAndUpdate(
      adminId,
      { $addToSet: { permissions: { $each: permissions } } },
      { new: true }
    );
  }

  async revokePermissions(adminId: string, permissions: string[]) {
    return Admin.findByIdAndUpdate(
      adminId,
      { $pull: { permissions: { $in: permissions } } },
      { new: true }
    );
  }
}

export const adminService = new AdminService();
