import mongoose from "mongoose";
import { adminService } from "../../services/adminService.js";
import { envConfig } from "../../config/envValidator.js";
import bcrypt from "bcrypt";

async function initSuperAdmin() {
  try {
    // Connect to MongoDB using the configured URI
    await mongoose.connect(envConfig.dbUrl);

    // Check if required superadmin credentials are configured
    if (!envConfig.superadminEmail || !envConfig.superadminPassword) {
      throw new Error(
        "Superadmin credentials not configured in environment variables"
      );
    }

    const superAdminData = {
      email: envConfig.superadminEmail,
      password: await bcrypt.hash(envConfig.superadminPassword, 10), // Hash the password
      fullName: "System Superadmin",
      role: "superadmin",
      permissions: ["all"],
      isVerified: true, // Superadmin is automatically verified
      emailVerified: true,
    };

    // Check if superadmin already exists
    const existingSuperadmin = await adminService.findAdminByEmail(
      superAdminData.email
    );
    if (existingSuperadmin) {
      console.log("Superadmin already exists");
      return;
    }

    // Create new superadmin
    const superadmin = await adminService.createAdmin(superAdminData);

    // Generate tokens for immediate use
    const { accessToken, refreshToken } = adminService.generateTokens(
      superadmin._id.toString(),
      superadmin.role
    );

    // Update refresh token in database
    await adminService.updateRefreshToken(
      superadmin._id.toString(),
      refreshToken
    );

    console.log("\nSuperadmin created successfully:");
    console.log("----------------------------------");
    console.log(`Email: ${superadmin.email}`);
    console.log(`ID: ${superadmin._id}`);
    console.log(`Access Token: ${accessToken}`);
    console.log("----------------------------------");
    console.log("IMPORTANT: Store these credentials securely!");
    console.log("----------------------------------\n");
  } catch (error) {
    console.error("\nFailed to create superadmin:");
    console.error("----------------------------------");
    console.error(error);
    console.error("----------------------------------");
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

// Execute the initialization
initSuperAdmin().catch((error) => {
  console.error("Unhandled error in superadmin initialization:", error);
  process.exit(1);
});
