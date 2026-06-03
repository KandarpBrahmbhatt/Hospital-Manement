const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/hpm";
const BASE_URL = "http://localhost:5000/api";

async function runTests() {
  console.log("Connecting to MongoDB to fetch references...");
  await mongoose.connect(MONGO_URL);
  
  // Get a doctor
  const doctor = await mongoose.connection.db.collection("doctors").findOne({});
  if (!doctor) {
    throw new Error("No doctors found in the database. Please run the seeder first.");
  }
  console.log("Found Doctor:", doctor.name, doctor._id.toString());

  // 1. Create a Patient
  console.log("\n--- Creating Patient ---");
  const patientRes = await fetch(`${BASE_URL}/patient/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Emergency Test Patient",
      age: 45,
      gender: "Male"
    })
  });
  
  const patientData = await patientRes.json();
  console.log("Patient Response:", patientData);
  const patientId = patientData.newpatient?._id;
  if (!patientId) {
    throw new Error("Failed to create patient");
  }

  // 2. Create Emergency Entry
  console.log("\n--- Creating Emergency Entry ---");
  const emergencyRes = await fetch(`${BASE_URL}/emargancy/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      patientId: patientId,
      assignedDoctor: doctor._id.toString(),
      severity: "CRITICAL",
      status: "WAITING",
      reason: "Acute chest pain and breathing difficulty"
    })
  });

  const emergencyData = await emergencyRes.json();
  console.log("Emergency Response:", emergencyData);
  const emergencyId = emergencyData.emargancy?._id;
  if (!emergencyId) {
    throw new Error("Failed to create emergency entry");
  }

  // 3. Get Emergency List
  console.log("\n--- Getting Emergency List (severity=CRITICAL) ---");
  const listRes = await fetch(`${BASE_URL}/emargancy/list?severity=CRITICAL&limit=5`);
  const listData = await listRes.json();
  console.log("List Response Status:", listRes.status);
  console.log("Total entries matching filter:", listData.total);
  console.log("Sample entry from list:", listData.emergencies?.[0]);

  // 4. Get Single Emergency Entry
  console.log("\n--- Getting Single Emergency Entry ---");
  const singleRes = await fetch(`${BASE_URL}/emargancy/${emergencyId}`);
  const singleData = await singleRes.json();
  console.log("Single Entry Response:", singleData);

  // 5. Update Emergency Entry
  console.log("\n--- Updating Emergency Entry ---");
  const updateRes = await fetch(`${BASE_URL}/emargancy/${emergencyId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      status: "IN_TREATMENT",
      severity: "CRITICAL"
    })
  });
  const updateData = await updateRes.json();
  console.log("Update Response:", updateData);

  // 6. Get Emergency Stats
  console.log("\n--- Getting Emergency Stats ---");
  const statsRes = await fetch(`${BASE_URL}/emargancy/stats`);
  const statsData = await statsRes.json();
  console.log("Stats Response:", JSON.stringify(statsData, null, 2));

  // 7. Delete Emergency Entry
  console.log("\n--- Deleting Emergency Entry ---");
  const deleteRes = await fetch(`${BASE_URL}/emargancy/${emergencyId}`, {
    method: "DELETE"
  });
  const deleteData = await deleteRes.json();
  console.log("Delete Response:", deleteData);

  // Cleanup patient
  console.log("\nCleaning up test patient...");
  await mongoose.connection.db.collection("patients").deleteOne({ _id: new mongoose.Types.ObjectId(patientId) });

  await mongoose.disconnect();
  console.log("\nAll tests completed successfully!");
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
