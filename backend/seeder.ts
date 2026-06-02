// import mongoose from "mongoose";
// import { faker } from "@faker-js/faker";

// import Department from "./models/department.ts";
// import Doctor from "./models/Doctor.ts";
// import Patient from "./models/patient.ts";
// import Appointment from "./models/appoiment.model.js";
// import Bill from "./models/bill.ts";

// const MONGO_URI =
//   "mongodb://localhost:27017/hpm";

// const BATCH_SIZE = 5000;

// async function connectDB() {
//   await mongoose.connect(MONGO_URI);
//   console.log("MongoDB Connected");
// }

// async function clearDatabase() {
//   console.log("Deleting old data...");

//   await Promise.all([
//     Department.deleteMany({}),
//     Doctor.deleteMany({}),
//     Patient.deleteMany({}),
//     Appointment.deleteMany({}),
//     Bill.deleteMany({}),
//   ]);

//   console.log("Old data deleted");
// }

// async function seedDepartments() {
//   const departments = [
//     "Cardiology",
//     "Neurology",
//     "Orthopedics",
//     "Dermatology",
//     "Pediatrics",
//     "Oncology",
//     "ENT",
//     "Radiology",
//     "Psychiatry",
//     "General Medicine",
//   ];

//   const docs = departments.map((name) => ({ name }));

//   return await Department.insertMany(docs);
// }

// async function seedDoctors(departments: any[]) {
//   const doctors = [];

//   for (let i = 0; i < 100; i++) {
//     doctors.push({
//       name: faker.person.fullName(),
//       consultationFee: faker.number.int({
//         min: 500,
//         max: 3000,
//       }),
//       departmentId:
//         departments[
//           faker.number.int({
//             min: 0,
//             max: departments.length - 1,
//           })
//         ]._id,
//     });
//   }

//   return await Doctor.insertMany(doctors);
// }

// async function seedPatients() {
//   console.log("Creating Patients...");

//   let insertedPatients: any[] = [];

//   for (let batch = 0; batch < 100000; batch += BATCH_SIZE) {
//     const patients = [];

//     for (let i = 0; i < BATCH_SIZE; i++) {
//       patients.push({
//         name: faker.person.fullName(),
//         age: faker.number.int({
//           min: 1,
//           max: 90,
//         }),
//         gender:
//           faker.helpers.arrayElement([
//             "Male",
//             "Female",
//           ]),
//       });
//     }

//     const result = await Patient.insertMany(patients);

//     insertedPatients.push(...result);

//     console.log(
//       `Patients Inserted: ${insertedPatients.length}`
//     );
//   }

//   return insertedPatients;
// }

// async function seedAppointments(
//   doctors: any[],
//   patients: any[]
// ) {
//   console.log("Creating Appointments...");

//   for (
//     let batch = 0;
//     batch < 500000;
//     batch += BATCH_SIZE
//   ) {
//     const appointments = [];

//     for (let i = 0; i < BATCH_SIZE; i++) {
//       appointments.push({
//         doctorId:
//           doctors[
//             faker.number.int({
//               min: 0,
//               max: doctors.length - 1,
//             })
//           ]._id,

//         patientId:
//           patients[
//             faker.number.int({
//               min: 0,
//               max: patients.length - 1,
//             })
//           ]._id,

//         appointmentDate: faker.date.recent({
//           days: 365,
//         }),

//         status: faker.helpers.arrayElement([
//           "Completed",
//           "Pending",
//           "Cancelled",
//         ]),
//       });
//     }

//     await Appointment.insertMany(appointments);

//     console.log(
//       `Appointments Inserted: ${batch + BATCH_SIZE}`
//     );
//   }
// }

// async function seedBills(
//   doctors: any[],
//   patients: any[]
// ) {
//   console.log("Creating Bills...");

//   for (
//     let batch = 0;
//     batch < 500000;
//     batch += BATCH_SIZE
//   ) {
//     const bills = [];

//     for (let i = 0; i < BATCH_SIZE; i++) {
//       bills.push({
//         doctorId:
//           doctors[
//             faker.number.int({
//               min: 0,
//               max: doctors.length - 1,
//             })
//           ]._id,

//         patientId:
//           patients[
//             faker.number.int({
//               min: 0,
//               max: patients.length - 1,
//             })
//           ]._id,

//         amount: faker.number.int({
//           min: 1000,
//           max: 50000,
//         }),

//         createdAt: faker.date.recent({
//           days: 365,
//         }),
//       });
//     }

//     await Bill.insertMany(bills);

//     console.log(
//       `Bills Inserted: ${batch + BATCH_SIZE}`
//     );
//   }
// }

// async function seed() {
//   try {
//     await connectDB();

//     await clearDatabase();

//     const departments =
//       await seedDepartments();

//     console.log(
//       "Departments:",
//       departments.length
//     );

//     const doctors =
//       await seedDoctors(departments);

//     console.log(
//       "Doctors:",
//       doctors.length
//     );

//     const patients =
//       await seedPatients();

//     console.log(
//       "Patients:",
//       patients.length
//     );

//     await seedAppointments(
//       doctors,
//       patients
//     );

//     await seedBills(
//       doctors,
//       patients
//     );

//     console.log(
//       "Hospital Seeder Completed"
//     );

//     process.exit(0);
//   } catch (error) {
//     console.error(error);
//     process.exit(1);
//   }
// }

// seed();





import mongoose from "mongoose";
import { faker } from "@faker-js/faker";


import Activity from "./models/activity.model.ts";
import Emergency from "./models/emaragansy.model.ts";
import Insurance from "./models/insuarance.model.ts";

import Department from "./models/department.ts";
import Doctor from "./models/Doctor.ts";
import Patient from "./models/patient.ts";
import Appointment from "./models/appoiment.model.ts";
import Bill from "./models/bill.ts";

const MONGO_URI = "mongodb://localhost:27017/hpm";
const BATCH_SIZE = 5000;
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
        email: faker.internet.email(),
        phone: faker.string.numeric(10),

        insurance: {
          hasInsurance: faker.datatype.boolean(),
          providerName: faker.company.name(),
          policyNumber: faker.string.alphanumeric(12),
          coverageLimit: faker.number.int({
            min: 50000,
            max: 500000,
          }),
          validTill: faker.date.future(),
        },
      });
    }

    await Patient.insertMany(patients);

    console.log(
      `Patients Inserted : ${Math.min(
        batch + BATCH_SIZE,
        TOTAL_PATIENTS
      )}`
    );
  }
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