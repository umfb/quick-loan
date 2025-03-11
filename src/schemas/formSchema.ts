import * as z from "zod";

export const formSchema = z.object({
  Cycle: z.string().nonempty("This field is required"),
  "Client ID Number": z.string().nonempty("This field is required"),
  "Applicant First Name": z.string().nonempty("This field is required"),
  "Applicant Middle Name": z.string().nonempty("This field is required"),
  "Applicant Last Name": z.string().nonempty("This field is required"),
  "Applicant DOB": z.string().nonempty("This field is required"),
  "ID Type": z.string().nonempty("This field is required"),
  "ID Number": z.string().nonempty("This field is required"),
  Sex: z.string().nonempty("This field is required"),
  BVN: z.string().nonempty("This field is required"),
  Nationality: z.string().nonempty("This field is required"),
  "Applicant First Phone Number": z.string().nonempty("This field is required"),
  "Applicant Second Phone Number": z
    .string()
    .nonempty("This field is required"),
  "Applicant Marital Status": z.string().nonempty("This field is required"),
  "Applicant State of Origin": z.string().nonempty("This field is required"),
  "Applicant LGA of Origin": z.string().nonempty("This field is required"),
  "Spouse First Name": z.string().nonempty("This field is required"),
  "Spouse Middle Name": z.string().nonempty("This field is required"),
  "Spouse Last Name": z.string().nonempty("This field is required"),
  "Spouse DOB": z.string().nonempty("This field is required"),
  "Spouse First Phone Number": z.string().nonempty("This field is required"),
  "Spouse Second Phone Number": z.string().nonempty("This field is required"),
  "Applicant Next of Kin": z.string().nonempty("This field is required"),
  "Next of Kin Sex": z.string().nonempty("This field is required"),
  "Next of Kin Relationship": z.string().nonempty("This field is required"),
  "Next of Kin Phone Number": z.string().nonempty("This field is required"),
  "Business Name": z.string().nonempty("This field is required"),
  "Business Type": z.string().nonempty("This field is required"),
  "Business Address": z.string().nonempty("This field is required"),
  "Business Activity": z.string().nonempty("This field is required"),
  "Location Since": z.string().nonempty("This field is required"),
  "Business Since": z.string().nonempty("This field is required"),
  "Tin Number": z.string().nonempty("This field is required"),
  "Loan Amount": z.string().nonempty("This field is required"),
  "How Much Can You Easily Pay Per Month": z
    .string()
    .nonempty("This field is required"),
  "Loan Purpose": z.string().nonempty("This field is required"),
  "Investment Plan": z.string().nonempty("This field is required"),
  "Do/did you/your spouse have a loan with another FI?": z
    .string()
    .nonempty("This field is required"),
  "How did you hear about UnilagMFB?": z
    .string()
    .nonempty("This field is required"),
  Date: z.string().nonempty("This field is required"),
});

export type FormDataType = z.infer<typeof formSchema>;
