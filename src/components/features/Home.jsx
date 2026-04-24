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

            setPdfUrl(url)
            setPdfFileName(`${fileName}_Resume.pdf`)
            window.open(url, "_blank", "noopener,noreferrer")
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
        <div className="min-h-screen bg-linear-to-b from-sky-100 via-slate-100 to-white text-slate-900">
            <div className="relative overflow-hidden">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-linear-to-br from-sky-200 via-white/0 to-transparent blur-3xl" />
                <div className="pointer-events-none absolute right-0 top-24 h-96 w-96 rounded-full bg-sky-300/20 blur-3xl" />

                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <header className="mb-10 text-center">
                        <span className="inline-flex rounded-full bg-sky-500/15 px-4 py-1 text-xl font-semibold uppercase tracking-[0.35em]">ATS Resume Builder</span>
                        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Create a polished, ATS-friendly resume instantly.</h1>
                        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">Fill the form, preview your resume live, and open the generated PDF in a new browser tab for final inspection or download.</p>
                    </header>

                    <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                        <aside className="p-3 rounded-4xl border border-slate-200/80 bg-white shadow-[0_35px_80px_-35px_rgba(15,23,42,0.12)] animate-fade-in-up">
                            <div className="mb-6 rounded-3xl bg-sky-50 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between text-center">
                                <div>
                                    <p className="text-sm uppercase tracking-[0.35em] text-sky-600">Step 1</p>
                                    <h2 className="mt-2 text-2xl font-semibold text-slate-950">Fill your details</h2>
                                </div>
                            </div>
                            <StudentForm onSubmitData={handleFormData} />
                        </aside>

                        <div className="space-y-6">
                            <div className="p-3 rounded-4xl border border-slate-200/80 bg-white shadow-[0_35px_80px_-35px_rgba(15,23,42,0.12)] animate-fade-in-up">
                                <div className="mb-6 rounded-3xl bg-sky-50 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between text-center">
                                    <div>
                                        <p className="text-sm uppercase tracking-[0.35em] text-sky-600">Step 2</p>
                                        <h2 className="mt-2 text-2xl font-semibold text-slate-950">Live resume preview</h2>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    {formData ? (
                                        <Preview ref={previewRef} data={formData} onDownload={generatePDF} />
                                    ) : (
                                        <div className="rounded-3xl border border-dashed border-slate-300/70 bg-slate-50 p-10 text-center text-slate-600">
                                            Your live preview will appear here after submitting the form.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {pdfUrl && (
                                <div className="rounded-4xl border border-slate-200/80 bg-white p-6 shadow-[0_35px_80px_-35px_rgba(15,23,42,0.1)] backdrop-blur-xl animate-fade-in-up">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm uppercase tracking-[0.35em] text-sky-600">PDF Ready</p>
                                            <h3 className="mt-2 text-xl font-semibold text-slate-950">Open or download your resume</h3>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            <button
                                                className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
                                                onClick={() => window.open(pdfUrl, "_blank", "noopener,noreferrer")}
                                                type="button"
                                            >
                                                Open PDF Preview
                                            </button>
                                            <button
                                                className="rounded-2xl bg-slate-700 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-600"
                                                onClick={downloadPDF}
                                                type="button"
                                            >
                                                Download PDF
                                            </button>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-sm text-slate-600">A new tab has opened with your PDF. Use the download button to save a local copy.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Home;
