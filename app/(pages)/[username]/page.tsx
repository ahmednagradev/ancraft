// app/[username]/page.tsx

import { notFound } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User.models";
import { Info } from "@/models/Info.models";
import "@/models/Project.models";


export default async function PublicPortfolioPage({
    params,
}: {
    params: Promise<{ username: string }>;
}) {
    await dbConnect();
    const { username } = await params;

    // Find user by username
    const user = await User.findOne({ username }).select("_id username");

    if (!user) {
        notFound();
    }
    console.log(String(user._id))

    // Find their portfolio with populated projects
    const portfolio = await Info.findOne({ createdBy: (user._id) }).populate("projects");
    console.log(portfolio)

    if (!portfolio) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">No Portfolio Yet</h1>
                    <p className="text-gray-600">This user hasn't created a portfolio.</p>
                </div>
            </div>
        );
    }

    // Convert to plain object
    const portfolioData = JSON.parse(JSON.stringify(portfolio));

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-white border-b">
                <div className="max-w-4xl mx-auto px-6 py-16">
                    <h1 className="text-4xl font-bold mb-3">{portfolioData.fullname}</h1>
                    <p className="text-xl text-gray-600 mb-4">{portfolioData.bio}</p>
                    <p className="text-gray-700 leading-relaxed">{portfolioData.description}</p>

                    {/* Social Links */}
                    {portfolioData.socialLinks && portfolioData.socialLinks.length > 0 && (
                        <div className="flex flex-wrap gap-3 mt-6">
                            {portfolioData.socialLinks.map((link: string, index: number) => (
                                <a
                                    key={index}
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition"
                                >
                                    {/* Extract domain name for display */}
                                    {new URL(link).hostname?.replace("www.", "")}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Projects Section */}
            {portfolioData.projects && portfolioData.projects.length > 0 && (
                <section className="max-w-4xl mx-auto px-6 py-12">
                    <h2 className="text-2xl font-bold mb-8">Projects</h2>
                    <div className="space-y-8">
                        {portfolioData.projects.map((project: any) => (
                            <div key={project._id} className="bg-white rounded-lg border p-6 hover:shadow-md transition">
                                {/* Project Header */}
                                <div className="flex items-start gap-4 mb-4">
                                    {project.projectLogo && (
                                        <img
                                            src={project.projectLogo}
                                            alt={project.projectName}
                                            className="w-12 h-12 rounded-lg object-cover"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold">{project.projectName}</h3>
                                        <p className="text-gray-600">{project.projectTitle}</p>
                                    </div>
                                </div>

                                {/* Project Image */}
                                {project.projectImage && (
                                    <img
                                        src={project.projectImage}
                                        alt={project.projectName}
                                        className="w-full h-64 object-cover rounded-lg mb-4"
                                    />
                                )}

                                {/* Project Description */}
                                <p className="text-gray-700 mb-4 leading-relaxed whitespace-pre-line">
                                    {project.projectDescription}
                                </p>

                                {/* Project Features */}
                                <div className="mb-4">
                                    <h4 className="font-semibold text-sm text-gray-500 uppercase mb-2">
                                        Key Features
                                    </h4>
                                    <p className="text-gray-700 whitespace-pre-line">{project.projectFeatures}</p>
                                </div>

                                {/* Project Links */}
                                {project.projectLinks && project.projectLinks.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {project.projectLinks.map((link: string, index: number) => (
                                            <a
                                                key={index}
                                                href={link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded text-sm transition"
                                            >
                                                View Link →
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Contact Section */}
            <section className="bg-white border-t">
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <h2 className="text-2xl font-bold mb-4">Get In Touch</h2>
                    <p className="text-gray-700 mb-4">
                        Feel free to reach out: <span className="font-semibold">{portfolioData.contact}</span>
                    </p>
                    {portfolioData.endNote && (
                        <p className="text-gray-600">{portfolioData.endNote}</p>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-100 border-t">
                <div className="max-w-4xl mx-auto px-6 py-6 text-center text-sm text-gray-600">
                    © {new Date().getFullYear()} {portfolioData.fullname}
                </div>
            </footer>
        </div>
    );
}
