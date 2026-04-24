import { forwardRef } from "react";

const Preview = forwardRef(({ data, onDownload }, ref) => {
    if (!data) return null;

    return (
        <div className="animate-fade-in-up">
            <div className="overflow-x-auto pb-4">
                <div ref={ref} style={{ width: '794px', minWidth: '794px' }} className="mx-auto bg-white shadow-xl shadow-slate-950/10">
                    {/* Header Section */}
                    <div className="border-b-4 border-sky-600 px-10 py-10 bg-linear-to-r from-slate-900 to-slate-800">
                        <h1 className="text-5xl font-bold text-white tracking-tight">{data.fullName}</h1>
                        <p className="mt-3 text-sm text-slate-100 space-y-1">
                            <div>📧 {data.email} | 📱 {data.phone}</div>
                            <div className="text-xs text-slate-300 mt-2">{data.degree?.category || 'Professional'} | {data.degreeCollege?.city || 'Location'}</div>
                        </p>
                    </div>

                    {/* Content Section */}
                    <div className="px-10 py-8 space-y-7">
                        {/* Professional Summary */}
                        <section>
                            <h2 className="text-base font-bold text-white bg-sky-600 px-4 py-2 mb-3 uppercase tracking-wider">Professional Summary</h2>
                            <p className="text-sm text-slate-700 leading-relaxed">
                                Dedicated {data.degree?.short || 'professional'} with expertise in {data.degree?.category || 'field'}. 
                                Passionate about delivering high-quality solutions with strong technical knowledge and proven project execution capabilities. 
                                Seeking to contribute to innovative projects and grow within a dynamic, forward-thinking organization.
                            </p>
                        </section>

                        {/* Education Section */}
                        <section>
                            <h2 className="text-base font-bold text-white bg-sky-600 px-4 py-2 mb-3 uppercase tracking-wider">Education</h2>
                            <div className="space-y-4">
                                <div className="border-l-4 border-sky-500 pl-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-900 text-base">{data.degree?.name || 'Degree'}</p>
                                            <p className="text-sm font-semibold text-slate-700">{data.degreeCollege?.name || 'Institution'}</p>
                                            <p className="text-xs text-slate-600 mt-1"> {data.degreeCollege?.city}, {data.degreeCollege?.state}</p>
                                        </div>
                                        <span className="text-sm font-bold text-white bg-sky-600 px-3 py-1 rounded">{data.degree?.category}</span>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-300">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-600 uppercase">12th Grade</p>
                                        <p className="text-sm text-slate-800">{data.twelthCollege}</p>
                                        <p className="text-xs font-bold text-sky-600">Percentage: {data.twelthPercentage}%</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-600 uppercase">School</p>
                                        <p className="text-sm text-slate-800">{data.schoolName}</p>
                                        <p className="text-xs font-bold text-sky-600">Percentage: {data.schoolPercentage}%</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Project Experience */}
                        <section>
                            <h2 className="text-base font-bold text-white bg-sky-600 px-4 py-2 mb-3 uppercase tracking-wider">Project Experience</h2>
                            <div className="border-l-4 border-sky-500 pl-4 space-y-2">
                                <div>
                                    <p className="font-bold text-slate-900 text-base">{data.project?.title || 'Project Title'}</p>
                                    <p className="text-sm font-semibold text-slate-700 italic">{data.project?.role || 'Role'}</p>
                                </div>
                                <p className="text-sm text-slate-700 leading-relaxed">{data.project?.project_desc || 'Project description'}</p>
                                <div>
                                    <p className="text-xs font-semibold text-slate-600 mb-2 uppercase">Technologies Used:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {data.project?.techstack?.split(',').map((tech, idx) => (
                                            <span key={idx} className="inline-block bg-sky-100 text-sky-900 text-xs px-3 py-1 rounded-full font-medium">
                                                {tech.trim()}
                                            </span>
                                        )) || <span className="text-xs text-slate-500">No tech stack provided</span>}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Job Description / Key Responsibilities */}
                        {data.job_desc && (
                            <section>
                                <h2 className="text-base font-bold text-white bg-sky-600 px-4 py-2 mb-3 uppercase tracking-wider">Key Responsibilities</h2>
                                <p className="text-sm text-slate-700 leading-relaxed">{data.job_desc}</p>
                            </section>
                        )}

                        {/* Skills Highlight */}
                        <section>
                            <h2 className="text-base font-bold text-white bg-sky-600 px-4 py-2 mb-3 uppercase tracking-wider">Core Competencies</h2>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-50 p-3 rounded">
                                    <p className="text-xs font-semibold text-slate-600">Technical</p>
                                    <p className="text-sm text-slate-800">Full Stack Development, Problem Solving</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded">
                                    <p className="text-xs font-semibold text-slate-600">Professional</p>
                                    <p className="text-sm text-slate-800">Team Collaboration, Project Management</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded">
                                    <p className="text-xs font-semibold text-slate-600">Languages</p>
                                    <p className="text-sm text-slate-800">English, Hindi</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded">
                                    <p className="text-xs font-semibold text-slate-600">Tools & Platforms</p>
                                    <p className="text-sm text-slate-800">Git, VS Code, Modern Web Stack</p>
                                </div>
                            </div>
                        </section>

                        {/* Certifications */}
                        <section>
                            <h2 className="text-base font-bold text-white bg-sky-600 px-4 py-2 mb-3 uppercase tracking-wider">Achievements</h2>
                            <ul className="text-sm text-slate-700 space-y-2 list-disc list-inside">
                                <li>Successfully delivered multiple projects with attention to detail and quality</li>
                                <li>Consistent academic performer with strong analytical and technical skills</li>
                                <li>Demonstrated ability to learn and adapt to new technologies quickly</li>
                            </ul>
                        </section>
                    </div>

                    {/* Footer */}
                    <div className="bg-slate-900 text-slate-300 px-10 py-4 text-center text-xs border-t-4 border-sky-600 mt-8">
                        <p>ATS-Compliant Resume | Built with ATS Resume Builder</p>
                    </div>
                </div>
            </div>

            <button
                className="mt-6 inline-flex items-center justify-center rounded-full bg-linear-to-r from-sky-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition duration-300 hover:scale-[1.02] hover:shadow-cyan-500/30"
                onClick={onDownload}
                type="button"
            >
                Preview PDF
            </button>
        </div>
    );
});

export default Preview;
