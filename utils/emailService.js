const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendWelcomeEmail = async (email, password) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Welcome to Patient Tracker App",
    html: `
            <h1>Welcome to Patient Tracker App!</h1>
            <p>Your account has been created successfully.</p>
            <p>Here are your login credentials:</p>
            <p>Email: ${email}</p>
            <p>Password: ${password}</p>
            <p>Please change your password after your first login.</p>
            <p>Best regards,<br>Patient Tracker Team</p>
        `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }
};

const sendPasswordResetOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Password Reset OTP",
    html: `
      <h1>Password Reset Request</h1>
      <p>You have requested to reset your password.</p>
      <p>Your OTP is: <strong>${otp}</strong></p>
      <p>This OTP will expire in 10 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
      <p>Best regards,<br>Patient Tracker Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending password reset OTP:", error);
    throw new Error("Failed to send password reset OTP");
  }
};

const sendPasswordChangedEmail = async (email) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Password Changed",
    html: `
      <h1>Password Changed Successfully</h1>
      <p>Your password has been changed successfully.</p>
      <p>If you did not make this change, please contact support immediately.</p>
      <p>Best regards,<br>Patient Tracker Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending password changed email:", error);
    throw new Error("Failed to send password changed email");
  }
};

const sendAppointmentNotification = async (email, appointmentDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Appointment Notification",
    html: `
            <h1>Appointment Notification</h1>
            <p>Your appointment has been ${appointmentDetails.status}.</p>
            <p>Date: ${appointmentDetails.date}</p>
            <p>Time: ${appointmentDetails.time}</p>
            <p>Doctor: ${appointmentDetails.doctorName}</p>
            <p>Reason: ${appointmentDetails.reason}</p>
            <p>Best regards,<br>Patient Tracker Team</p>
        `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending appointment notification:", error);
    throw new Error("Failed to send appointment notification");
  }
};

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetOTP,
  sendPasswordChangedEmail,
  sendAppointmentNotification,
};
