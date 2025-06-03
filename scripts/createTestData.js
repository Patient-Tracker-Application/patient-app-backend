require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/userModel");
const Appointment = require("../models/appointmentModel");
const connectDB = require("../config/db_connect");
const { generateRandomPassword } = require("../utils/helpers");

const createTestData = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Clear existing data
    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Appointment.deleteMany({});
    console.log("Existing data cleared successfully!");

    // Generate passwords
    const drSmithPassword = generateRandomPassword();
    const drJohnsonPassword = generateRandomPassword();
    const johnDoePassword = generateRandomPassword();
    const janeSmithPassword = generateRandomPassword();

    // Create test doctors
    const doctors = await User.create([
      {
        email: "dr.smith@patienttracker.com",
        password: drSmithPassword,
        firstName: "John",
        lastName: "Smith",
        role: "doctor",
        phoneNumber: "1234567890",
        sex: "male",
        address: "123 Medical Center Dr",
        dob: new Date("1980-05-15"),
        profilePic: "doctor1.jpg",
        username: "dr.smith",
        maritalStatus: "married",
        age: "43",
        qualifications: ["MD", "PhD"],
        yearsOfExperience: 15,
        degreeType: "Medical Doctor",
        hospital: "City General Hospital",
        specialization: "Cardiology",
      },
      {
        email: "dr.johnson@patienttracker.com",
        password: drJohnsonPassword,
        firstName: "Sarah",
        lastName: "Johnson",
        role: "doctor",
        phoneNumber: "2345678901",
        sex: "female",
        address: "456 Health Plaza",
        dob: new Date("1985-08-20"),
        profilePic: "doctor2.jpg",
        username: "dr.johnson",
        maritalStatus: "single",
        age: "38",
        qualifications: ["MD"],
        yearsOfExperience: 10,
        degreeType: "Medical Doctor",
        hospital: "City General Hospital",
        specialization: "Pediatrics",
      },
    ]);

    // Create test patients
    const patients = await User.create([
      {
        email: "john.doe@patienttracker.com",
        password: johnDoePassword,
        firstName: "John",
        lastName: "Doe",
        role: "patient",
        phoneNumber: "3456789012",
        sex: "male",
        address: "789 Patient St",
        dob: new Date("1990-03-10"),
        profilePic: "patient1.jpg",
        emergencyNumber: "911",
        allergies: ["Penicillin", "Peanuts"],
        pastSurgeries: ["Appendectomy"],
        bloodGroup: "O+",
        genotype: "AA",
        lifestyleDiseases: ["Hypertension"],
        hereditaryDiseases: ["Diabetes"],
        chronicConditions: ["Asthma"],
        currentMedications: ["Ventolin", "Metformin"],
      },
      {
        email: "jane.smith@patienttracker.com",
        password: janeSmithPassword,
        firstName: "Jane",
        lastName: "Smith",
        role: "patient",
        phoneNumber: "4567890123",
        sex: "female",
        address: "321 Health Ave",
        dob: new Date("1988-07-25"),
        profilePic: "patient2.jpg",
        emergencyNumber: "911",
        allergies: ["Shellfish"],
        pastSurgeries: ["Cataract Surgery"],
        bloodGroup: "A+",
        genotype: "AS",
        lifestyleDiseases: [],
        hereditaryDiseases: ["Heart Disease"],
        chronicConditions: ["Migraine"],
        currentMedications: ["Sumatriptan"],
      },
    ]);

    // Create appointments
    const appointments = await Appointment.create([
      {
        patient: patients[0]._id,
        doctor: doctors[0]._id,
        date: new Date("2024-03-20"),
        time: "09:00",
        status: "scheduled",
        reason: "Regular checkup",
        notes: "Annual physical examination",
        followUp: true,
        followUpDate: new Date("2024-04-20"),
      },
      {
        patient: patients[1]._id,
        doctor: doctors[1]._id,
        date: new Date("2024-03-21"),
        time: "14:30",
        status: "scheduled",
        reason: "Child vaccination",
        notes: "Routine immunization schedule",
        followUp: false,
      },
      {
        patient: patients[0]._id,
        doctor: doctors[0]._id,
        date: new Date("2024-03-15"),
        time: "10:00",
        status: "completed",
        reason: "Follow-up consultation",
        notes: "Blood pressure check",
        followUp: false,
      },
      {
        patient: patients[1]._id,
        doctor: doctors[1]._id,
        date: new Date("2024-03-10"),
        time: "11:00",
        status: "cancelled",
        reason: "Emergency consultation",
        notes: "Patient requested cancellation",
        followUp: true,
        followUpDate: new Date("2024-03-25"),
      },
    ]);

    console.log("\nTest data created successfully!");
    console.log("\nCreated Doctors:");
    console.log(`1. Dr. John Smith (dr.smith@patienttracker.com)`);
    console.log(`   Password: ${drSmithPassword}`);
    console.log(`2. Dr. Sarah Johnson (dr.johnson@patienttracker.com)`);
    console.log(`   Password: ${drJohnsonPassword}`);

    console.log("\nCreated Patients:");
    console.log(`1. John Doe (john.doe@patienttracker.com)`);
    console.log(`   Password: ${johnDoePassword}`);
    console.log(`2. Jane Smith (jane.smith@patienttracker.com)`);
    console.log(`   Password: ${janeSmithPassword}`);

    console.log("\nCreated Appointments:");
    appointments.forEach((appointment) => {
      console.log(
        `- ${appointment.date.toDateString()} at ${appointment.time} (${
          appointment.status
        })`
      );
    });

    process.exit(0);
  } catch (error) {
    console.error("Error creating test data:", error);
    process.exit(1);
  }
};

createTestData();
