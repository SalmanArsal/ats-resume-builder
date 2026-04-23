import * as yup from "yup";

export const schema = yup.object({
  fullName: yup
    .string()
    .required("Full name is required")
    .min(3, "Minimum 3 characters"),

  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email"),

  phone: yup
    .string()
    .required("Phone is required")
    .matches(/^[0-9]{10}$/, "Enter valid 10-digit number"),

  degreeCollege: yup
    .object()
    .nullable()
    .required("Select a college"),

  degree: yup
    .object()
    .nullable()
    .required("Select a Degree"),

  project: yup
    .object()
    .required("Project is required"),
});