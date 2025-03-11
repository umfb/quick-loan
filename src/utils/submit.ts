import { jsPDF } from "jspdf";
import axios from "axios";
import { imageLoader } from "./loadImage";
import { currencyFormatter } from "./formatCurrency";
import { sanitizer } from "./sanitizeFileName";
import { dateFormatter } from "./formatDate";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function showErrorNotification(message: string) {
  toast.error(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    style: { background: "#f56565", color: "#fff" },
  });
}

function showSuccessNotification(message: string) {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    style: { background: "#48bb78", color: "#fff" },
  });
}

export async function submit(
  data: Record<string, any>,
  images: Record<string, any>,
  setIsLoading: (value: boolean) => void,
  reset: () => void
) {
  try {
    const doc = new jsPDF();

    const marginX = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const lineHeight = 7;
    let cursorY = 37;
    const maxWidth = pageWidth - marginX * 2;

    const title = "Guarantor Assessment Form";
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(24);
    const titleWidth = doc.getTextWidth(title);
    const titlePositionX = (pageWidth - titleWidth) / 2;
    const titlePositionY = 20;

    doc.text(title, titlePositionX, titlePositionY);

    doc.setLineWidth(0.5);
    doc.line(
      titlePositionX,
      titlePositionY + 2,
      titlePositionX + titleWidth,
      titlePositionY + 2
    );

    const logo = await imageLoader("/mfb-logo.png");
    if (logo) {
      doc.addImage(logo, "PNG", maxWidth - 16, 5, 20, 20);
    }

    if (data.length < 1) return;

    console.log(Array.isArray(data));

    Object.keys(data).forEach((key) => {
      const value = data[key];

      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (typeof item === "object") {
            Object.keys(item).forEach((subKey) => {
              const subValue = item[subKey];
              const keyText = `${key}-${subKey}:  `;
              let valueText = subValue;

              if (
                keyText.toLowerCase().includes("date") ||
                keyText.toLowerCase().includes("since") ||
                keyText.toLowerCase().includes("dob")
              ) {
                valueText = dateFormatter(subValue);
              } else if (
                keyText.toLowerCase().includes("amount") ||
                keyText.toLowerCase().includes("pay")
              ) {
                valueText = currencyFormatter(subValue);
              }

              const keyWidth = doc.getTextWidth(keyText);
              const remainingWidth = maxWidth - keyWidth;
              const splittedValue = doc.splitTextToSize(
                valueText,
                remainingWidth
              );
              const totalItemHeight = splittedValue.length * lineHeight;

              if (cursorY + totalItemHeight > pageHeight - marginX) {
                doc.addPage();
                cursorY = 20;
              }

              if (splittedValue.length > 0) {
                doc.setFontSize(16);
                doc.setFont("Helvetica", "normal");
                doc.text(keyText + splittedValue[0], marginX, cursorY);
                for (let i = 1; i < splittedValue.length; i++) {
                  doc.text(
                    splittedValue[i],
                    marginX + keyWidth,
                    cursorY + i * lineHeight
                  );
                }
              }

              cursorY += splittedValue.length * lineHeight + lineHeight;
            });
          }
        });
      } else {
        const keyText = `${key}:  `;
        let valueText = value || "";

        if (
          keyText.toLowerCase().includes("date") ||
          keyText.toLowerCase().includes("since") ||
          keyText.toLowerCase().includes("dob")
        ) {
          valueText = dateFormatter(valueText);
        } else if (
          keyText.toLowerCase().includes("amount") ||
          keyText.toLowerCase().includes("pay")
        ) {
          valueText = currencyFormatter(valueText);
        }

        const keyWidth = doc.getTextWidth(keyText);
        const remainingWidth = maxWidth - keyWidth;
        const splittedValue = doc.splitTextToSize(valueText, remainingWidth);
        const totalItemHeight = splittedValue.length * lineHeight;

        if (cursorY + totalItemHeight > pageHeight - marginX) {
          doc.addPage();
          cursorY = 20;
        }

        if (splittedValue.length > 0) {
          doc.setFontSize(16);
          doc.setFont("Helvetica", "normal");
          doc.text(keyText + splittedValue[0], marginX, cursorY);
          for (let i = 1; i < splittedValue.length; i++) {
            doc.text(
              splittedValue[i],
              marginX + keyWidth,
              cursorY + i * lineHeight
            );
          }
        }

        cursorY += splittedValue.length * lineHeight + lineHeight;
      }
    });
    const pdfBuffer = doc.output("arraybuffer");
    const base64Pdf = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      if (!reader) return;
      reader.onloadend = () => resolve(reader.result?.toString().split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(new Blob([pdfBuffer]));
    });

    console.log(images);

    if (!images.mimeType || !images.base64) return;

    if (!images.base64.startsWith("data:")) {
      images.base64 = `data:${images.mimeType};base64,${images.base64}`;
    }

    if (!images.name) return;
    const imageAttachment = {
      content: images.base64.split(",")[1],
      name:
        sanitizer(images.name) &&
        `${sanitizer(images.name)}.${images.mimeType.split("/")[1]}`,
      contentType: images.mimeType,
    };

    if (!imageAttachment) return;

    const emailData = {
      sender: {
        name: "Unilag Microfinance Bank",
        email: "info@unilagmfbank.com",
      },
      to: [{ email: "it-unit@unilagmfbank.com", name: "UMFB" }],
      subject: "Family Unit Assessment Form",
      htmlContent: "<b>Please find the attached loan form and images.</b>",
      attachment: [
        {
          content: base64Pdf,
          name: "family-unit-assessment-form.pdf",
          type: "application/pdf",
        },
        { ...imageAttachment },
      ],
    };
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        emailData,
        {
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            "api-key": import.meta.env.VITE_BREVO_API_KEY,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        showSuccessNotification("Loan request submitted!");
        reset();
      } else {
        showErrorNotification("Failed to send email.");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  } catch (error) {
    console.log(error);
    setIsLoading(false);
  }
}
