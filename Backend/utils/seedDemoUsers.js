const User = require("../model/user-model");
const encryptPass = require("./encryptPass");

/**
 * Automatically seeds default Demo accounts for reviewers & recruiters if missing.
 */
async function seedDemoUsers() {
  try {
    const demoAccounts = [
      {
        fullName: "Demo Patient",
        email: "patient@mediq.care",
        password: "Password123!",
        role: "PATIENT",
        gender: "MALE",
        age: 30,
        dob: new Date("1994-05-15"),
      },
      {
        fullName: "Dr. Sarah Jenkins",
        email: "doctor@mediq.care",
        password: "Password123!",
        role: "DOCTOR",
        gender: "FEMALE",
        age: 38,
        dob: new Date("1986-08-22"),
        doctorProfile: {
          degree: "MBBS, MD Cardiology",
          experience: 12,
          consultationFee: 150,
          description: "Senior Cardiologist specializing in preventive heart health.",
          hospitalAddress: "MEDIQ Healthcare Center, Suite 402, NY",
          licenseNumber: "MD-9988-77",
          isVerified: true,
          available: true,
          maxAppointmentsPerDay: 15,
          isActive: true,
        },
      },
      {
        fullName: "System Administrator",
        email: "admin@mediq.care",
        password: "Password123!",
        role: "ADMIN",
        gender: "MALE",
        age: 40,
        dob: new Date("1984-01-10"),
      },
    ];

    for (const acc of demoAccounts) {
      const existing = await User.findOne({ email: acc.email });
      if (!existing) {
        const hashedPassword = await encryptPass(acc.password);
        await User.create({
          ...acc,
          password: hashedPassword,
        });
        console.log(`[Demo Seed] 👤 Created demo account: ${acc.email} (${acc.role})`);
      }
    }
  } catch (err) {
    console.error("[Demo Seed] ⚠️ Seed check failed:", err.message);
  }
}

module.exports = seedDemoUsers;
