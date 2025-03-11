import { useForm } from "react-hook-form";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormDataType, formSchema } from "../schemas/formSchema";
import NavBar from "../components/NavBar";
import FormHeader from "../components/FormHeader";
import MiniHeader from "../components/MiniHeader";
import { useEffect, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import Authorization from "../components/Authorization";
import { ImageDataType } from "../models/ImageDataType";
import { ToastContainer } from "react-toastify";
import { submit } from "../utils/submit";

export default function Form() {
  const stateRef = useRef<HTMLSelectElement | null>(null);
  const lgaRef = useRef<HTMLSelectElement | null>(null);
  const canvasRef = useRef<SignatureCanvas | null>(null);
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  async function fetchStates() {
    const fetchedStates: Record<string, any> = await axios.get(
      "https://nga-states-lga.onrender.com/fetch"
    );
    if (fetchedStates) setStates(fetchedStates.data);
    console.log(fetchedStates);
  }

  async function fetchLGA() {
    if (!stateRef.current) return;
    const fetchedLGAs: Record<string, any> = await axios.get(
      `https://nga-states-lga.onrender.com/?state=${stateRef.current?.value}`
    );
    if (!lgaRef.current) return;
    lgaRef.current.value = "";
    setLGA(fetchedLGAs.data);
    console.log(fetchedLGAs);
    console.log(stateRef.current.value);
  }

  function handleEnd() {
    if (canvasRef.current) {
      setIsEmpty(canvasRef.current.isEmpty());
    }
  }

  function clearSignature() {
    if (canvasRef.current) canvasRef.current.clear();
    setIsEmpty(true);
  }

  function saveSignature() {
    if (canvasRef.current && !canvasRef.current.isEmpty()) {
      const imageUrl = canvasRef.current.toDataURL("image/png");
      const [header, base64] = imageUrl.split(",");
      const mimeType = header.split(":")[1].split(";")[0];
      const canvasElement = document.getElementById(`signature`);
      console.log(canvasElement);

      if (canvasElement) {
        const name = "signature";
        const imageFile = {
          mimeType,
          name,
          base64,
        };

        setSignatureFile(imageFile);
        console.log(imageFile);
      } else {
        console.log("Name is missing");
      }
    }
  }

  function onSubmit(data: FormDataType) {
    if (
      signatureFile.mimeType !== "" &&
      signatureFile.name !== "" &&
      signatureFile.base64 !== ""
    ) {
      const sortedData = { ...data, "Applicant Signature": "true" };
      console.log(sortedData);

      submit(sortedData, signatureFile, setIsLoading, reset);
    }
  }

  const [states, setStates] = useState<Array<string>>([]);
  const [LGA, setLGA] = useState<Array<string>>([]);
  const [isEmpty, setIsEmpty] = useState(true);
  const [signatureFile, setSignatureFile] = useState<ImageDataType>({
    mimeType: "",
    name: "",
    base64: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchStates();
  }, []);

  const {
    ref: stateRegisterRef,
    onChange: formOnChange,
    ...rest
  } = register("Applicant State of Origin");

  const { ref: lgaRegisterRef, ...lgaRest } = register(
    "Applicant LGA of Origin"
  );

  return (
    <div className="border mx-auto md:p-5 py-5 overflow-auto h-screen relative">
      <div className="fixed top-0 left-0 text-center h-[150px] bg-white z-10 w-full shadow-md">
        <NavBar />
      </div>
      <div className="h-fit pb-10 lg:w-[70%] w-full mx-auto mt-[150px] border-1 border-[#800] md:px-8 px-2 rounded-lg">
        <FormHeader title="QUICK LOAN APPLICATION FORM" />
        <form
          onSubmit={handleSubmit(onSubmit, (errors) => {
            console.log(errors);
          })}
          className="flex flex-col gap-3 mx-auto md:px-3 mt-3 inter"
        >
          <div className="row">
            <div className="wrapper-custom col-12 col-lg-6">
              <label htmlFor="cycle" className="label-custom">
                Cycle
              </label>
              <select
                {...register("Cycle")}
                name="Cycle"
                id="cycle"
                className="input-custom"
              >
                <option className="bg-gray-300" value="">
                  --Pick an Option--
                </option>
                <option value="New Cycle">New Cycle</option>
                <option value="Recurrent Cycle">Recurrent Cycle</option>
              </select>
              {errors.Cycle && (
                <p className="error-message">{errors.Cycle.message}</p>
              )}
            </div>
            <div className="wrapper-custom col-12 col-lg-6">
              <label htmlFor="client-id-no" className="label-custom">
                Client's ID Number
              </label>
              <input
                {...register("Client ID Number")}
                type="text"
                id="client-id-no"
                name="Client ID Number"
                placeholder="ID Number"
                className="input-custom"
              />
              {errors["Client ID Number"] && (
                <p className="error-message">
                  {errors["Client ID Number"].message}
                </p>
              )}
            </div>
          </div>
          <div className="my-2">
            <MiniHeader title="PERSONAL INFORMATION" />
          </div>
          <div className="row">
            <div className="wrapper-custom col-12 col-lg-6">
              <label htmlFor="first-name" className="label-custom">
                Applicant's First Name
              </label>
              <input
                {...register("Applicant First Name")}
                type="text"
                id="first-name"
                name="Applicant First Name"
                placeholder="First Name"
                className="input-custom"
              />
              {errors["Applicant First Name"] && (
                <p className="error-message">
                  {errors["Applicant First Name"].message}
                </p>
              )}
            </div>
            <div className="wrapper-custom col-12 col-lg-6">
              <label htmlFor="middle-name" className="label-custom">
                Applicant's Middle Name
              </label>
              <input
                {...register("Applicant Middle Name")}
                type="text"
                id="middle-name"
                name="Applicant Middle Name"
                placeholder="Middle Name"
                className="input-custom"
              />
              {errors["Applicant Middle Name"] && (
                <p className="error-message">
                  {errors["Applicant Middle Name"].message}
                </p>
              )}
            </div>
          </div>
          <div className="row">
            <div className="wrapper-custom col-12 col-lg-6">
              <label htmlFor="last-name" className="label-custom">
                Applicant's Last Name
              </label>
              <input
                {...register("Applicant Last Name")}
                type="text"
                id="last-name"
                name="Applicant Last Name"
                placeholder="Last Name"
                className="input-custom"
              />
              {errors["Applicant Last Name"] && (
                <p className="error-message">
                  {errors["Applicant Last Name"].message}
                </p>
              )}
            </div>
            <div className="wrapper-custom col-12 col-lg-6">
              <label htmlFor="applicant-dob" className="label-custom">
                Applicant's Date of Birth
              </label>
              <input
                {...register("Applicant DOB")}
                type="date"
                id="applicant-dob"
                name="Applicant DOB"
                className="input-custom"
              />
              {errors["Applicant DOB"] && (
                <p className="error-message">
                  {errors["Applicant DOB"].message}
                </p>
              )}
            </div>
          </div>
          <div className="row">
            <div className="wrapper-custom col-12 col-lg-4">
              <label htmlFor="id-type" className="label-custom">
                Type of ID
              </label>
              <input
                {...register("ID Type")}
                type="text"
                id="id-type"
                name="ID Type"
                placeholder="First Name"
                className="input-custom"
              />
              {errors["ID Type"] && (
                <p className="error-message">{errors["ID Type"].message}</p>
              )}
            </div>
            <div className="wrapper-custom col-12 col-lg-4">
              <label htmlFor="id-number" className="label-custom">
                ID Number
              </label>
              <input
                {...register("ID Number")}
                type="text"
                id="id-number"
                name="ID Number"
                placeholder="ID Number"
                className="input-custom"
              />
              {errors["ID Number"] && (
                <p className="error-message">{errors["ID Number"].message}</p>
              )}
            </div>
            <div className="wrapper-custom col-12 col-lg-4">
              <label htmlFor="sex" className="label-custom">
                Sex
              </label>
              <select
                {...register("Sex")}
                name="Sex"
                id="sex"
                className="input-custom"
              >
                <option className="bg-gray-300" value="">
                  --Sex--
                </option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Others">Others</option>
              </select>
              {errors["Sex"] && (
                <p className="error-message">{errors["Sex"].message}</p>
              )}
            </div>
          </div>
          <div className="row">
            <div className="wrapper-custom col-12 col-lg-6">
              <label htmlFor="bvn" className="label-custom">
                BVN
              </label>
              <input
                {...register("BVN")}
                type="text"
                id="bvn"
                name="BVN"
                placeholder="BVN"
                className="input-custom"
              />
              {errors["BVN"] && (
                <p className="error-message">{errors["BVN"].message}</p>
              )}
            </div>
            <div className="wrapper-custom col-12 col-lg-6">
              <label htmlFor="nationality" className="label-custom">
                Nationality
              </label>
              <input
                {...register("Nationality")}
                type="text"
                id="nationality"
                name="Nationality"
                placeholder="Nationality"
                className="input-custom"
              />
              {errors["Nationality"] && (
                <p className="error-message">{errors["Nationality"].message}</p>
              )}
            </div>
          </div>
          <div className="row">
            <div className="wrapper-custom col-12 col-lg-6">
              <label htmlFor="first-num" className="label-custom">
                Phone Number 1
              </label>
              <input
                {...register("Applicant First Phone Number")}
                type="text"
                id="first-num"
                name="Applicant First Phone Number"
                placeholder="Phone Number"
                className="input-custom"
              />
              {errors["Applicant First Phone Number"] && (
                <p className="error-message">
                  {errors["Applicant First Phone Number"].message}
                </p>
              )}
            </div>
            <div className="wrapper-custom col-12 col-lg-6">
              <label htmlFor="second-num" className="label-custom">
                Phone Number 2
              </label>
              <input
                {...register("Applicant Second Phone Number")}
                type="text"
                id="second-num"
                name="Applicant Second Phone Number"
                placeholder="Phone Number"
                className="input-custom"
              />
              {errors["Applicant Second Phone Number"] && (
                <p className="error-message">
                  {errors["Applicant Second Phone Number"].message}
                </p>
              )}
            </div>
          </div>
          <div className="row">
            <div className="wrapper-custom">
              <label htmlFor="marital-status" className="label-custom">
                Marital Status
              </label>
              <select
                {...register("Applicant Marital Status")}
                className="input-custom"
                name="Applicant Marital Status"
                id="marital-status"
              >
                <option className="bg-gray-300" value="">
                  --Marital Status--
                </option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
              {errors["Applicant Marital Status"] && (
                <p className="error-message">
                  {errors["Applicant Marital Status"].message}
                </p>
              )}
            </div>
          </div>
          <div className="row">
            <div className="wrapper-custom col-12 col-lg-6">
              <label htmlFor="state" className="label-custom">
                State of Origin
              </label>
              <select
                {...rest}
                id="state"
                ref={(e) => {
                  stateRegisterRef(e);
                  stateRef.current = e;
                }}
                onChange={(e) => {
                  formOnChange(e);
                  fetchLGA();
                }}
                className="input-custom"
              >
                <option value="">--Select a State--</option>
                {states.map((state, index) => (
                  <option key={index} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {errors["Applicant State of Origin"] && (
                <p className="error-message">
                  {errors["Applicant State of Origin"].message}
                </p>
              )}
            </div>
            <div className="wrapper-custom col-12 col-lg-6">
              <label htmlFor="lga" className="label-custom">
                LGA
              </label>
              <select
                {...lgaRest}
                id="lga"
                ref={(e) => {
                  lgaRegisterRef(e);
                  lgaRef.current = e;
                }}
                className="input-custom"
              >
                <option className="bg-gray-300" value="">
                  --LGA--
                </option>
                {LGA.map((lga, index) => (
                  <option key={index} value={lga}>
                    {lga}
                  </option>
                ))}
              </select>
              {errors["Applicant LGA of Origin"] && (
                <p className="error-message">
                  {errors["Applicant LGA of Origin"].message}
                </p>
              )}
            </div>
          </div>
          <div className="row">
            <div className="wrapper-custom col-12 col-lg-6">
              <label htmlFor="spouse-first-name" className="label-custom">
                Spouse's First Name
              </label>
              <input
                {...register("Spouse First Name")}
                type="text"
                id="spouse-first-name"
                name="Spouse First Name"
                placeholder="First Name"
                className="input-custom"
              />
              {errors["Spouse First Name"] && (
                <p className="error-message">
                  {errors["Spouse First Name"].message}
                </p>
              )}
            </div>
            <div className="wrapper-custom col-12 col-lg-6">
              <label htmlFor="spouse-middle-name" className="label-custom">
                Spouse's Middle Name
              </label>
              <input
                {...register("Spouse Middle Name")}
                className="input-custom"
                id="spouse-middle-name"
                name="Spouse Middle Name"
                type="text"
                placeholder="Middle Name"
              />
              {errors["Spouse Middle Name"] && (
                <p className="error-message">
                  {errors["Spouse Middle Name"].message}
                </p>
              )}
            </div>
          </div>
          <div className="row">
            <div className="wrapper-custom col-12 col-lg-6">
              <label htmlFor="spouse-last-name" className="label-custom">
                Spouse's Last Name
              </label>
              <input
                {...register("Spouse Last Name")}
                type="text"
                id="spouse-last-name"
                name="Spouse Last Name"
                placeholder="Last Name"
                className="input-custom"
              />
              {errors["Spouse Last Name"] && (
                <p className="error-message">
                  {errors["Spouse Last Name"].message}
                </p>
              )}
            </div>
            <div className="wrapper-custom col-12 col-lg-6">
              <label htmlFor="spouse-dob" className="label-custom">
                Spouse's Date of Birth
              </label>
              <input
                {...register("Spouse DOB")}
                type="date"
                name="Spouse DOB"
                id="spouse-dob"
                className="input-custom"
              />
              {errors["Spouse DOB"] && (
                <p className="error-message">{errors["Spouse DOB"].message}</p>
              )}
            </div>
          </div>
          <div className="row">
            <div className="wrapper-custom col-12 col-lg-6">
              <label htmlFor="spouse-phone-1" className="label-custom">
                Spouse's First Phone Number
              </label>
              <input
                {...register("Spouse First Phone Number")}
                type="text"
                id="spouse-phone-1"
                name="Spouse First Phone Number"
                placeholder="Phone Number"
                className="input-custom"
              />
              {errors["Spouse First Phone Number"] && (
                <p className="error-message">
                  {errors["Spouse First Phone Number"].message}
                </p>
              )}
            </div>
            <div className="wrapper-custom col-12 col-lg-6">
              <label htmlFor="spouse-phone-2" className="label-custom">
                Spouse's Second Phone Number
              </label>
              <input
                {...register("Spouse Second Phone Number")}
                type="text"
                name="Spouse Second Phone Number"
                id="spouse-phone-2"
                placeholder="Phone Number"
                className="input-custom"
              />
              {errors["Spouse Second Phone Number"] && (
                <p className="error-message">
                  {errors["Spouse Second Phone Number"].message}
                </p>
              )}
            </div>
          </div>
          <div className="row">
            <div className="wrapper-custom col-12 col-lg-6">
              <label htmlFor="next-of-kin" className="label-custom">
                Next of Kin's Name
              </label>
              <input
                {...register("Applicant Next of Kin")}
                type="text"
                id="next-of-kin"
                name="Applicant Next of Kin"
                placeholder="Name"
                className="input-custom"
              />
              {errors["Applicant Next of Kin"] && (
                <p className="error-message">
                  {errors["Applicant Next of Kin"].message}
                </p>
              )}
            </div>
            <div className="wrapper-custom col-12 col-lg-6">
              <label htmlFor="next-of-kin-sex" className="label-custom">
                Next of Kin's Sex
              </label>
              <select
                {...register("Next of Kin Sex")}
                className="input-custom"
                name="Next of Kin Sex"
                id="next-of-kin"
              >
                <option className="bg-gray-300" value="">
                  --Sex--
                </option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Others">Others</option>
              </select>
              {errors["Spouse DOB"] && (
                <p className="error-message">{errors["Spouse DOB"].message}</p>
              )}
            </div>
          </div>
          <div className="row">
            <div className="wrapper-custom col-12 col-lg-6">
              <label htmlFor="relationship" className="label-custom">
                Next of Kin's Relationship
              </label>
              <input
                {...register("Next of Kin Relationship")}
                type="text"
                id="relationship"
                name="Next of Kin Relationship"
                placeholder="Relationship with Next of Kin"
                className="input-custom"
              />
              {errors["Next of Kin Relationship"] && (
                <p className="error-message">
                  {errors["Next of Kin Relationship"].message}
                </p>
              )}
            </div>
            <div className="wrapper-custom col-12 col-lg-6">
              <label htmlFor="next-of-kin-phone" className="label-custom">
                Next of Kin's Phone
              </label>
              <input
                {...register("Next of Kin Phone Number")}
                id="next-of-kin-phone"
                name="Next of Kin Phone Number"
                type="text"
                placeholder="Phone Number"
                className="input-custom"
              />
              {errors["Next of Kin Phone Number"] && (
                <p className="error-message">
                  {errors["Next of Kin Phone Number"].message}
                </p>
              )}
            </div>
          </div>
          <div className="my">
            <MiniHeader title="BUSINESS INFORMATION" />
          </div>
          <div className="row">
            <div className="wrapper-custom col-12 col-lg-6">
              <label htmlFor="biz-name" className="label-custom">
                Business Name
              </label>
              <input
                {...register("Business Name")}
                type="text"
                id="biz-name"
                name="Business Name"
                placeholder="Business Name"
                className="input-custom"
              />
              {errors["Business Name"] && (
                <p className="error-message">
                  {errors["Business Name"].message}
                </p>
              )}
            </div>
            <div className="wrapper-custom col-12 col-lg-6">
              <label htmlFor="biz-type" className="label-custom">
                Business Type
              </label>
              <select
                {...register("Business Type")}
                name="Business Type"
                id="biz-type"
                className="input-custom"
              >
                <option className="bg-gray-300" value="">
                  --Business Type--
                </option>
                <option value="No Registration">No Registration</option>
                <option value="Sole Proprietor">Sole Proprietor</option>
                <option value="LTD">LTD</option>
                <option value="Partnership">Partnership</option>
              </select>
              {errors["Business Type"] && (
                <p className="error-message">
                  {errors["Business Type"].message}
                </p>
              )}
            </div>
          </div>
          <div className="row">
            <div className="wrapper-custom col-12 col-lg-6">
              <label htmlFor="business-address" className="label-custom">
                Business Address
              </label>
              <input
                {...register("Business Address")}
                id="business-address"
                name="Business Address"
                placeholder="Business Adddress"
                type="text"
                className="input-custom"
              />
              {errors["Business Address"] && (
                <p className="error-message">
                  {errors["Business Address"].message}
                </p>
              )}
            </div>
            <div className="wrapper-custom col-12 col-lg-6">
              <label htmlFor="business-activity" className="label-custom">
                Business Activity
              </label>
              <input
                {...register("Business Activity")}
                id="business-activity"
                name="Business Activity"
                placeholder="Business Activity"
                type="text"
                className="input-custom"
              />
              {errors["Business Activity"] && (
                <p className="error-message">
                  {errors["Business Activity"].message}
                </p>
              )}
            </div>
          </div>
          <div className="row">
            <div className="wrapper-custom col-12 col-lg-4">
              <label htmlFor="business-since" className="label-custom">
                Business Since
              </label>
              <input
                {...register("Business Since")}
                type="date"
                name="Business Since"
                id="business-since"
                className="input-custom"
              />
              {errors["Business Since"] && (
                <p className="error-message">
                  {errors["Business Since"].message}
                </p>
              )}
            </div>
            <div className="wrapper-custom col-12 col-lg-4">
              <label htmlFor="location-since" className="label-custom">
                Location Since
              </label>
              <input
                {...register("Location Since")}
                type="date"
                name="Location Since"
                id="location-since"
                className="input-custom"
              />
              {errors["Location Since"] && (
                <p className="error-mesage">
                  {errors["Location Since"].message}
                </p>
              )}
            </div>
            <div className="wrapper-custom col-12 col-lg-4">
              <label htmlFor="tin" className="label-custom">
                TIN Number
              </label>
              <input
                {...register("Tin Number")}
                id="tin"
                name="Tin Number"
                placeholder="Tin Number"
                type="text"
                className="input-custom"
              />
              {errors["Tin Number"] && (
                <p className="error-message">{errors["Tin Number"].message}</p>
              )}
            </div>
          </div>
          <div className="my-2">
            <MiniHeader title="LOAN REQUEST" />
          </div>
          <div className="row">
            <div className="wrapper-custom col-12 col-lg-6">
              <label htmlFor="loan-amount" className="label-custom">
                Loan Amount
              </label>
              <input
                {...register("Loan Amount")}
                id="loan-amount"
                name="Loan Amount"
                placeholder="How much loan are you requesting for?"
                type="text"
                className="input-custom"
              />
              {errors["Loan Amount"] && (
                <p className="error-message">{errors["Loan Amount"].message}</p>
              )}
            </div>
            <div className="wrapper-custom col-12 col-lg-6">
              <label htmlFor="loan-repay" className="label-custom">
                How much can you easily pay per month?
              </label>
              <input
                {...register("How Much Can You Easily Pay Per Month")}
                id="loan-repay"
                name="How Much Can You Easily Pay Per Month"
                placeholder="How Much Can You Easily Pay Per Month?"
                type="text"
                className="input-custom"
              />
              {errors["How Much Can You Easily Pay Per Month"] && (
                <p className="error-message">
                  {errors["How Much Can You Easily Pay Per Month"].message}
                </p>
              )}
            </div>
          </div>
          <div className="row">
            <div className="wrapper-custom">
              <label htmlFor="loan-purpose" className="label-custom">
                Loan Purpose
              </label>
              <input
                {...register("Loan Purpose")}
                id="loan-purpose"
                name="Loan Purpose"
                placeholder="Loan Purpose"
                type="text"
                className="input-custom"
              />
              {errors["Loan Purpose"] && (
                <p className="error-message">
                  {errors["Loan Purpose"].message}
                </p>
              )}
            </div>
          </div>
          <div className="row">
            <div className="wrapper-custom">
              <label htmlFor="investment-plan" className="label-custom">
                Investment Plan
              </label>
              <textarea
                {...register("Investment Plan")}
                id="investment-plan"
                name="Investment Plan"
                placeholder="Investment Plan"
                cols={10}
                rows={10}
                className="input-custom"
              ></textarea>
              {errors["Investment Plan"] && (
                <p className="error-message">
                  {errors["Investment Plan"].message}
                </p>
              )}
            </div>
          </div>
          <div className="row">
            <div className="wrapper-custom col-12 col-lg-6">
              <label htmlFor="fi" className="label-custom">
                Do/did you/your spouse have a loan with another FI?
              </label>
              <input
                {...register(
                  "Do/did you/your spouse have a loan with another FI?"
                )}
                id="fi"
                name="Do/did you/your spouse have a loan with another FI?"
                placeholder="Do/did you/your spouse have a loan with another FI?"
                type="text"
                className="input-custom"
              />
              {errors[
                "Do/did you/your spouse have a loan with another FI?"
              ] && (
                <p className="error-message">
                  {
                    errors[
                      "Do/did you/your spouse have a loan with another FI?"
                    ].message
                  }
                </p>
              )}
            </div>
            <div className="wrapper-custom col-12 col-lg-6">
              <label htmlFor="ads" className="label-custom">
                How did you hear about UnilagMFB?
              </label>
              <input
                {...register("How did you hear about UnilagMFB?")}
                id="ads"
                name="How did you hear about UnilagMFB?"
                placeholder="How did you hear about UnilagMFB?"
                type="text"
                className="input-custom"
              />
              {errors["How did you hear about UnilagMFB?"] && (
                <p className="error-message">
                  {errors["How did you hear about UnilagMFB?"].message}
                </p>
              )}
            </div>
          </div>
          <Authorization />
          <div className="col-12 col-lg-5">
            <SignatureCanvas
              ref={canvasRef}
              canvasProps={{
                width: 400,
                height: 200,
                className: "sigCanvas",
                id: "signature",
              }}
              onEnd={handleEnd}
            />
            <div className="flex items-center mt-2 gap-2">
              <button
                onClick={clearSignature}
                disabled={isEmpty}
                type="button"
                className={`text-white p-2 bg-red-500 active:scale-105 disabled:cursor-not-allowed disabled:bg-red-300`}
              >
                Clear
              </button>
              <button
                className="bg-green-500 disabled:bg-green-300 p-2 active:scale-105 text-white disabled:cursor-not-allowed"
                disabled={isEmpty}
                onClick={saveSignature}
                type="button"
              >
                Save
              </button>
            </div>
          </div>
          <div className="wrapper-custom col-12 col-lg-6">
            <label htmlFor="date" className="label-custom">
              Date
            </label>
            <input
              {...register("Date")}
              type="date"
              name="Date"
              id="date"
              className="input-custom"
            />
            {errors["Date"] && (
              <p className="error-message">{errors["Date"].message}</p>
            )}
          </div>
          <button
            disabled={isLoading}
            type="submit"
            className="flex justify-center py-1 rounded bg-[#800] text-white text-2xl disabled:bg-red-200 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="h-8 w-8 rounded-full border-t-[#800] border-red-300 border-3 animate-spin"></div>
            ) : (
              <span className="text-white text-2xl">Submit</span>
            )}
          </button>
          <ToastContainer />
        </form>
      </div>
    </div>
  );
}
