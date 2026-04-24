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
            const dataUrl = await toPng(previewRef.current, {
                cacheBust: true,
                pixelRatio: 2,
                backgroundColor: "#ffffff",
            });

            const pdf = new jsPDF("p", "mm", "a4");

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Convert image dimensions to PDF scale
            const imgProps = pdf.getImageProperties(dataUrl);
            const imgWidth = pdfWidth;
            const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

            let heightLeft = imgHeight;
            let position = 0;

            // First page
            pdf.addImage(dataUrl, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;

            // Remaining pages
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(dataUrl, "PNG", 0, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            const fileName =
                formData.fullName?.replace(/\s+/g, "_") || "Resume";

            const pdfBlob = pdf.output("blob")
            const url = URL.createObjectURL(pdfBlob)

            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl)
            }

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
                                <h2 className="text-xl font-semibold">PDF Preview</h2>
                                <button
                                    className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700"
                                    onClick={downloadPDF}
                                    type="button"
                                >
                                    Download PDF
                                </button>
                            </div>
                            <iframe
                                src={pdfUrl}
                                title="Resume PDF Preview"
                                className="w-full h-[700px] border rounded-lg"
                            />
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
