import React, { useState, useRef } from 'react'
import StudentForm from './StudentForm.jsx'
import { Typography } from '@mui/material'
import Preview from './Preview.jsx'
import { toPng } from "html-to-image";
import jsPDF from "jspdf";


const Home = () => {
    const previewRef = useRef(null);

    const [formData, setFormData] = useState()

    const handleFormData = (data) => {
        setFormData(data)
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

            pdf.save(`${fileName}_Resume.pdf`);
        } catch (error) {
            console.error("PDF generation failed", error);
        }
    };

    return (
        <>
        <h1 className='text-5xl text-center bg-yellow-100 py-5'>ATS RESUME BUILDER</h1>
        <div className="bg-yellow-100 flex justify-center">
            <StudentForm onSubmitData={handleFormData} />

            {formData ? (
                <Preview
                    ref={previewRef}
                    data={formData}
                    onDownload={generatePDF}
                /> 
            ) : <div className='p-5 '>
                <h1 className='text-2xl mt-70 m-auto'>Preview would be displayed here after the form submission</h1>
                </div>}

        </div>
        </>
    );
};

export default Home;
