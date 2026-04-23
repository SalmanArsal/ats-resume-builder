import { Button } from "@mui/material";
import { forwardRef } from "react";

const Preview = forwardRef(({ data, onDownload }, ref) => {
    if (!data) return null;

    return (
        <div>
            <div ref={ref} className="max-w-3xl mx-auto p-6 space-y-6">
                {/* Header */}
                <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3">
                    Profile Preview
                </h2>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <p>
                        <span className="font-medium text-gray-600">Full Name:</span>{" "}
                        <span className="text-gray-800">{data.fullName}</span>
                    </p>
                    <p>
                        <span className="font-medium text-gray-600">Email:</span>{" "}
                        <span className="text-gray-800">{data.email}</span>
                    </p>
                    <p>
                        <span className="font-medium text-gray-600">Phone:</span>{" "}
                        <span className="text-gray-800">{data.phone}</span>
                    </p>
                </div>

                {/* Degree Section */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        Degree Details
                    </h3>
                    <div className="bg-gray-200 rounded-lg p-4 space-y-1">
                        <p>
                            <span className="font-medium">Degree:</span>{" "}
                            {data.degree?.name}
                        </p>
                        <p>
                            <span className="font-medium">Short:</span>{" "}
                            {data.degree?.short}
                        </p>
                        <p>
                            <span className="font-medium">Category:</span>{" "}
                            {data.degree?.category}
                        </p>
                    </div>
                </div>

                {/* Education Section */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        College Details
                    </h3>
                    <div className="bg-gray-200 rounded-lg p-4 space-y-1">
                        <p>
                            <span className="font-medium">Name:</span>{" "}
                            {data.degreeCollege?.name}
                        </p>
                        <p>
                            <span className="font-medium">City:</span>{" "}
                            {data.degreeCollege?.city}
                        </p>
                        <p>
                            <span className="font-medium">State:</span>{" "}
                            {data.degreeCollege?.state}
                        </p>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        12th Details
                    </h3>
                    <div className="bg-gray-200 rounded-lg p-4 space-y-1">
                        <p>
                            <span className="font-medium">College Name:</span>{" "}
                            {data.twelthCollege}
                        </p>
                        <p>
                            <span className="font-medium">Percentage:</span>{" "}
                            {data.twelthPercentage}
                        </p>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        School Details
                    </h3>
                    <div className="bg-gray-200 rounded-lg p-4 space-y-1">
                        <p>
                            <span className="font-medium">School Name:</span>{" "}
                            {data.schoolName}
                        </p>
                        <p>
                            <span className="font-medium">Percentage:</span>{" "}
                            {data.schoolPercentage}
                        </p>
                    </div>

                </div>

                {/* Project Section */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        Project Details
                    </h3>
                    <div className="bg-gray-200 rounded-lg p-4 space-y-2">
                        <p>
                            <span className="font-medium">Title:</span>{" "}
                            {data.project?.title}
                        </p>
                        <p>
                            <span className="font-medium">Role:</span>{" "}
                            {data.project?.role}
                        </p>
                        <p>
                            <span className="font-medium">Description:</span>{" "}
                            {data.project?.project_desc}
                        </p>
                        <p>
                            <span className="font-medium">Tech Stack:</span>{" "}
                            {data.project?.techstack}
                        </p>
                    </div>
                </div>
            </div>
            <button className="bg-sky-400 p-3 print:hidden hover:cursor-pointer ms-3 mb-3" onClick={onDownload} variant="contained">
                Generate PDF
            </button>
        </div>
    );
});

export default Preview;
