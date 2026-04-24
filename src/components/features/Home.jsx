import React, { useState, useRef, useEffect } from 'react'
import StudentForm from './StudentForm.jsx'
import Preview from './Preview.jsx'
import { toPng } from "html-to-image";
import jsPDF from "jspdf";


const Home = () => {
    const previewRef = useRef(null);

    const [formData, setFormData] = useState()
    const [pdfUrl, setPdfUrl] = useState(null)
    const [pdfFileName, setPdfFileName] = useState("")

    useEffect(() => {
        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl)
            }
        }
    }, [pdfUrl])

    const handleFormData = (data) => {
        setFormData(data)
        setPdfUrl(null)
        setPdfFileName("")
    }

    const generatePDF = async () => {
        if (!previewRef.current || !formData) return;

        try {
            const clone = previewRef.current.cloneNode(true);
            clone.style.width = "794px";
            clone.style.maxWidth = "794px";
            clone.style.boxSizing = "border-box";

            const container = document.createElement("div");
            container.style.position = "fixed";
            container.style.top = "-9999px";
            container.style.left = "-9999px";
            container.style.width = "794px";
            container.style.overflow = "hidden";
            container.appendChild(clone);
            document.body.appendChild(container);

            const dataUrl = await toPng(clone, {
                cacheBust: true,
                pixelRatio: 2,
                backgroundColor: "#ffffff",
            });

            document.body.removeChild(container);

            const pdf = new jsPDF("p", "mm", "a4");

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const margin = 10;
            const usableWidth = pdfWidth - margin * 2;
            const usableHeight = pdfHeight - margin * 2;

            // Convert image dimensions to PDF scale
            const imgProps = pdf.getImageProperties(dataUrl);
            const imgWidth = usableWidth;
            const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

            pdf.addImage(dataUrl, "PNG", margin, margin, imgWidth, imgHeight);

            let remainingHeight = imgHeight - usableHeight;
            let pageIndex = 1;

            while (remainingHeight > 0) {
                pdf.addPage();
                const yOffset = margin - pageIndex * usableHeight;
                pdf.addImage(dataUrl, "PNG", margin, yOffset, imgWidth, imgHeight);
                remainingHeight -= usableHeight;
                pageIndex += 1;
            }

            const fileName =
                formData.fullName?.replace(/\s+/g, "_") || "Resume";

            const pdfBlob = pdf.output("blob")
            const url = URL.createObjectURL(pdfBlob)

            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl)
            }

            window.open(url, "_blank", "noopener,noreferrer")
            setPdfUrl(url)
            setPdfFileName(`${fileName}_Resume.pdf`)
        } catch (error) {
            console.error("PDF generation failed", error);
        }
    };

    const downloadPDF = () => {
        if (!pdfUrl || !pdfFileName) return;

        const link = document.createElement("a")
        link.href = pdfUrl
        link.download = pdfFileName
        link.click()
    }

    return (
        <>
        <h1 className='text-5xl text-center bg-yellow-100 py-5'>ATS RESUME BUILDER</h1>
        <div className="bg-yellow-100 flex justify-center">
            <StudentForm onSubmitData={handleFormData} />

            {formData ? (
                <div className="flex flex-col gap-6 w-full">
                    <Preview
                        ref={previewRef}
                        data={formData}
                        onDownload={generatePDF}
                    />

                    {pdfUrl && (
                        <div className="w-full bg-white rounded-xl shadow-sm p-4">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4">
                                <h2 className="text-xl font-semibold">PDF Generated</h2>
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700"
                                        onClick={() => window.open(pdfUrl, "_blank", "noopener,noreferrer")}
                                        type="button"
                                    >
                                        Open PDF Preview
                                    </button>
                                    <button
                                        className="bg-slate-700 text-white px-4 py-2 rounded hover:bg-slate-900"
                                        onClick={downloadPDF}
                                        type="button"
                                    >
                                        Download PDF
                                    </button>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">The PDF preview has been opened in a new tab. Use Download PDF to save the file.</p>
                        </div>
                    )}
                </div>
            ) : <div className='p-5 '>
                <h1 className='text-2xl mt-70 m-auto'>Preview would be displayed here after the form submission</h1>
                </div>}

        </div>
        </>
    );
};

export default Home;
