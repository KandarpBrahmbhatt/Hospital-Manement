import mongoose from "mongoose";
import { faker } from "@faker-js/faker";


import Activity from "./models/activity.model";
import Emergency from "./models/emaragansy.model";
import Insurance from "./models/insuarance.model";

import Department from "./models/department";
import Doctor from "./models/Doctor";
import Patient from "./models/patient";
import Appointment from "./models/appoiment.model";
import Bill from "./models/bill";
import Token from "./models/token.model"
import Role from "./models/roll.model"
import Ward from './models/ward.model'
import User from "./models/user.model"
import MedicalRecord from './models/medicalRecord.model'
import { encryptData } from "./utiles/AES";
import process from "node:process";

const MONGO_URI = "mongodb://localhost:27017/hpm";
const BATCH_SIZE = 25000;
const TOTAL_PATIENTS = 1000000;
async function seedDepartments() {
  console.log("Seeding Departments...");

  const departments = [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Dermatology",
    "Pediatrics",
    "Oncology",
    "Psychiatry",
    "ENT",
    "General Medicine",
    "Urology",
    "Radiology",
    "Emergency",
    "Gynecology",
    "Ophthalmology",
    "Dental",
    "Pathology",
    "Surgery",
    "Physiotherapy",
    "Nephrology",
    "Pulmonology",
  ];

  await Department.deleteMany({});

  const docs = departments.map((name) => ({ name }));

  return Department.insertMany(docs);
}

async function seedDoctors(departmentIds: any[]) {
  console.log("Seeding Doctors...");

  await Doctor.deleteMany({});

  const doctors = [];

  for (let i = 0; i < 500; i++) {
    doctors.push({
      name: faker.person.fullName(),
      departmentId:
        departmentIds[
        Math.floor(Math.random() * departmentIds.length)
        ],
      consultationFee: faker.number.int({
        min: 300,
        max: 3000,
      }),
    });
  }

  return Doctor.insertMany(doctors);
}

// async function seedPatients() {
//   console.log("Seeding Patients...");

//   await Patient.deleteMany({});

//   for (
//     let batch = 0;
//     batch < TOTAL_PATIENTS;
//     batch += BATCH_SIZE
//   ) {
//     const patients = [];

//     for (let i = 0; i < BATCH_SIZE; i++) {
//       patients.push({
//         name: faker.person.fullName(),
//         age: faker.number.int({
//           min: 1,
//           max: 90,
//         }),
//         gender: faker.helpers.arrayElement([
//           "Male",
//           "Female",
//           "Other",
//         ]),
//         email: faker.internet.email(),
//         phone: faker.string.numeric(10),

//         insurance: {
//           hasInsurance: faker.datatype.boolean(),
//           providerName: faker.company.name(),
//           policyNumber: faker.string.alphanumeric(12),
//           coverageLimit: faker.number.int({
//             min: 50000,
//             max: 500000,
//           }),
//           validTill: faker.date.future(),
//         },
//       });
//     }

//     await Patient.insertMany(patients);

//     console.log(
//       `Patients Inserted : ${Math.min(
//         batch + BATCH_SIZE,
//         TOTAL_PATIENTS
//       )}`
//     );
//   }
// }

async function seedPatients() {
  console.log("Seeding Patients...");

  await Patient.deleteMany({});

  for (
    let batch = 0;
    batch < TOTAL_PATIENTS;
    batch += BATCH_SIZE
  ) {
    const patients = [];

    for (let i = 0; i < BATCH_SIZE; i++) {

      const aadhaarNumber =
        faker.string.numeric(12);

      const emergencyContact =
        faker.string.numeric(10);

      patients.push({
        name: faker.person.fullName(),

        age: faker.number.int({
          min: 1,
          max: 90,
        }),

        gender: faker.helpers.arrayElement([
          "Male",
          "Female",
          "Other",
        ]),

        email: `${faker.internet.username()}_${batch}_${i}@gmail.com`,

        phone: faker.string.numeric(10),

        aadhaarNumber: encryptData(
          aadhaarNumber
        ),

        emergencyContact: encryptData(
          emergencyContact
        ),

        insurance: {
          hasInsurance:
            faker.datatype.boolean(),

          providerName:
            faker.company.name(),

          policyNumber:
            faker.string.alphanumeric(12),

          coverageLimit:
            faker.number.int({
              min: 50000,
              max: 500000,
            }),

          validTill:
            faker.date.future(),
        },
      });
    }

    await Patient.insertMany(
      patients,
      {
        ordered: false,
      }
    );

    console.log(
      `Patients Inserted : ${Math.min(
        batch + BATCH_SIZE,
        TOTAL_PATIENTS
      )}`
    );
  }

  console.log(
    "Patients Created Successfully"
  );
}

async function seedRelatedData() {
  console.log("Loading IDs...");

  const patientIds = await Patient.find()
    .select("_id")
    .lean();

  const doctorIds = await Doctor.find()
    .select("_id")
    .lean();

  const patientPool = patientIds.map(
    (p: any) => p._id
  );

  const doctorPool = doctorIds.map(
    (d: any) => d._id
  );

  console.log("Creating Appointments...");
  await Appointment.deleteMany({});

  for (
    let batch = 0;
    batch < TOTAL_PATIENTS;
    batch += BATCH_SIZE
  ) {
    const appointments = [];

    for (let i = 0; i < BATCH_SIZE; i++) {
      appointments.push({
        patientId:
          patientPool[
          Math.floor(
            Math.random() * patientPool.length
          )
          ],

        doctorId:
          doctorPool[
          Math.floor(
            Math.random() * doctorPool.length
          )
          ],

        appointmentDate: faker.date.recent(),

        status: faker.helpers.arrayElement([
          "Completed",
          "Pending",
          "Cancelled",
        ]),
      });
    }

    await Appointment.insertMany(appointments);
    console.log(
      `Appointments : ${batch + BATCH_SIZE}`
    );
  }

  console.log("Creating Bills...");
  await Bill.deleteMany({});

  for (
    let batch = 0;
    batch < TOTAL_PATIENTS;
    batch += BATCH_SIZE
  ) {
    const bills = [];

    for (let i = 0; i < BATCH_SIZE; i++) {
      bills.push({
        patientId:
          patientPool[
          Math.floor(
            Math.random() * patientPool.length
          )
          ],

        doctorId:
          doctorPool[
          Math.floor(
            Math.random() * doctorPool.length
          )
          ],

        amount: faker.number.int({
          min: 500,
          max: 50000,
        }),
      });
    }

    await Bill.insertMany(bills);

    console.log(
      `Bills : ${batch + BATCH_SIZE}`
    );
  }

  console.log("Creating Activities...");
  await Activity.deleteMany({});

  for (
    let batch = 0;
    batch < TOTAL_PATIENTS;
    batch += BATCH_SIZE
  ) {
    const activities = [];

    for (let i = 0; i < BATCH_SIZE; i++) {
      activities.push({
        patientId:
          patientPool[
          Math.floor(
            Math.random() * patientPool.length
          )
          ],

        activities: [
          {
            activityType:
              faker.helpers.arrayElement([
                "PATIENT_CREATED",
                "APPOINTMENT_BOOKED",
                "APPOINTMENT_CANCELLED",
                "DOCTOR_VISITED",
                "BILL_CREATED",
              ]),
            description:
              faker.lorem.sentence(),
          },
        ],
      });
    }

    await Activity.insertMany(activities, {
      ordered: false,
    });

    console.log(
      `Activities : ${batch + BATCH_SIZE}`
    );
  }

  console.log("Creating Emergencies...");
  await Emergency.deleteMany({});

  const emergencies = [];

  for (let i = 0; i < 200000; i++) {
    emergencies.push({
      patientId:
        patientPool[
        Math.floor(
          Math.random() * patientPool.length
        )
        ],

      assignedDoctor:
        doctorPool[
        Math.floor(
          Math.random() * doctorPool.length
        )
        ],

      severity: faker.helpers.arrayElement([
        "LOW",
        "MEDIUM",
        "HIGH",
        "CRITICAL",
      ]),

      status: faker.helpers.arrayElement([
        "WAITING",
        "IN_TREATMENT",
        "STABILIZED",
        "ADMITTED",
      ]),

      reason: faker.lorem.sentence(),
    });

    if (emergencies.length === BATCH_SIZE) {
      await Emergency.insertMany(emergencies);
      emergencies.length = 0;
    }
  }

  console.log("Creating Insurance...");
  await Insurance.deleteMany({});

  const insurances = [];

  for (let i = 0; i < 500000; i++) {
    insurances.push({
      patientId:
        patientPool[
        Math.floor(
          Math.random() * patientPool.length
        )
        ],

      providerName: faker.company.name(),
      policyNumber:
        faker.string.alphanumeric(12),

      coverageLimit: faker.number.int({
        min: 100000,
        max: 1000000,
      }),

      usedAmount: faker.number.int({
        min: 0,
        max: 50000,
      }),

      validFrom: faker.date.past(),
      validTill: faker.date.future(),

      status: faker.helpers.arrayElement([
        "ACTIVE",
        "EXPIRED",
        "SUSPENDED",
      ]),

      cardNumber:
        faker.string.numeric(16),
    });

    if (insurances.length === BATCH_SIZE) {
      await Insurance.insertMany(insurances);
      insurances.length = 0;
    }
  }
}

async function seedRoles () {
  await Role.deleteMany({});

  await Role.insertMany([
    {
      name: "ADMIN",
      permissions: ["*"],
    },

    {
      name: "DOCTOR",
      permissions: [
        "patient:view",
        "appointment:view",
        "appointment:update",
        "token:manage",
      ],
    },

    {
      name: "RECEPTIONIST",
      permissions: [
        "patient:create",
        "patient:view",
        "appointment:create",
        "token:create",
      ],
    },

    {
      name: "ACCOUNTANT",
      permissions: [
        "bill:create",
        "bill:view",
      ],
    },
  ]);
};

async function seedTokens() {
  console.log("Creating Tokens...");

  await Token.deleteMany({});

  const patientIds = await Patient.find()
    .select("_id")
    .lean();

  const doctorIds = await Doctor.find()
    .select("_id")
    .lean();

  const patientPool = patientIds.map(
    (p: any) => p._id
  );

  const doctorPool = doctorIds.map(
    (d: any) => d._id
  );

  const TOTAL_TOKENS = 1000000;

  for (
    let batch = 0;
    batch < TOTAL_TOKENS;
    batch += BATCH_SIZE
  ) {
    const tokens = [];

    for (let i = 0; i < BATCH_SIZE; i++) {
      tokens.push({
        patientId:
          patientPool[
          Math.floor(
            Math.random() * patientPool.length
          )
          ],

        doctorId:
          doctorPool[
          Math.floor(
            Math.random() * doctorPool.length
          )
          ],

        tokenNumber: batch + i + 1,

        priority: faker.number.int({
          min: 0,
          max: 3,
        }),

        status: faker.helpers.arrayElement([
          "WAITING",
          "CALLED",
          "IN_PROGRESS",
          "COMPLETED",
        ]),
      });
    }

    await Token.insertMany(tokens, {
      ordered: false,
    });

    console.log(
      `Tokens Inserted : ${Math.min(
        batch + BATCH_SIZE,
        TOTAL_TOKENS
      )}`
    );
  }
}

async function seedWards() {
  console.log("Creating Wards...");

  await Ward.deleteMany({});

  const wards = [];

  for (let i = 1; i <= 100; i++) {
    wards.push({
      wardName: `Ward-${i}`,
      wardType: faker.helpers.arrayElement([
        "General",
        "Private",
        "ICU",
      ]),
      totalBeds: faker.number.int({
        min: 10,
        max: 100,
      }),
    });
  }

  await Ward.insertMany(wards);

  console.log("Wards Created");
}

async function seedUsers() {
  console.log("Creating Users...");

  await User.deleteMany({});

  const roles = await Role.find()
    .select("_id")
    .lean();

  const rolePool = roles.map(
    (r: any) => r._id
  );

  const TOTAL_USERS = 1000000;

  for (
    let batch = 0;
    batch < TOTAL_USERS;
    batch += BATCH_SIZE
  ) {
    const users = [];

    for (let i = 0; i < BATCH_SIZE; i++) {
      users.push({
        name: faker.person.fullName(),
        email: `${faker.internet.username()}_${batch}_${i}@gmail.com`,
        password: "$2b$10$abcdefghijk123456789",
        roleId:
          rolePool[
            Math.floor(
              Math.random() *
                rolePool.length
            )
          ],
      });
    }

    await User.insertMany(users, {
      ordered: false,
    });

    console.log(
      `Users : ${Math.min(
        batch + BATCH_SIZE,
        TOTAL_USERS
      )}`
    );
  }
}

async function seedMedicalRecords() {
  console.log(
    "Creating Medical Records..."
  );

  await MedicalRecord.deleteMany({});

  const patientIds = await Patient.find()
    .select("_id")
    .lean();

  const doctorIds = await Doctor.find()
    .select("_id")
    .lean();

  const patientPool = patientIds.map(
    (p: any) => p._id
  );

  const doctorPool = doctorIds.map(
    (d: any) => d._id
  );

  const TOTAL_RECORDS = 1000000;

  for (
    let batch = 0;
    batch < TOTAL_RECORDS;
    batch += BATCH_SIZE
  ) {
    const records = [];

    for (let i = 0; i < BATCH_SIZE; i++) {
      records.push({
        patientId:
          patientPool[
            Math.floor(
              Math.random() *
                patientPool.length
            )
          ],

        doctorId:
          doctorPool[
            Math.floor(
              Math.random() *
                doctorPool.length
            )
          ],

        diagnosis:
          faker.helpers.arrayElement([
            "Diabetes",
            "Asthma",
            "Hypertension",
            "Migraine",
            "Viral Fever",
            "Fracture",
          ]),

        symptoms: [
          faker.lorem.word(),
          faker.lorem.word(),
          faker.lorem.word(),
        ],

        prescription: [
          {
            medicine:
              faker.helpers.arrayElement([
                "Paracetamol",
                "Metformin",
                "Ibuprofen",
                "Amoxicillin",
              ]),
            dosage: "1 Tablet",
            duration: "5 Days",
          },
        ],

        allergies: [
          faker.helpers.arrayElement([
            "Dust",
            "Milk",
            "Pollen",
            "Peanuts",
            "None",
          ]),
        ],

        treatmentNotes:
          faker.lorem.paragraph(),

        doctorRemarks:
          faker.lorem.sentence(),

        labReports: [
          {
            fileUrl:
              faker.internet.url(),
            uploadedAt:
              faker.date.recent(),
          },
        ],
      });
    }

    await MedicalRecord.insertMany(
      records,
      {
        ordered: false,
      }
    );

    console.log(
      `Medical Records : ${Math.min(
        batch + BATCH_SIZE,
        TOTAL_RECORDS
      )}`
    );
  }
}


async function seed() {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("Mongo Connected");

    const departments =
      await seedDepartments();

    const doctors = await seedDoctors(
      departments.map((d: any) => d._id)
    );

    await seedPatients();

    await seedRelatedData();
    
    seedRoles()

     await seedWards();

    await seedUsers();

    await seedMedicalRecords();

    await seedTokens();

    console.log(
      " 10 Lakh Dataset Generated Successfully"
    );

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seed();