"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { InfoInput } from "@/schemas/infoSchema";
import { ProjectInput } from "@/schemas/projectSchema";
import { toast } from "sonner";

interface InfoType extends InfoInput {
    _id: string;
    createdAt: string;
}

interface ProjectType extends ProjectInput {
    _id: string;
    createdAt: string;
}

const Dashboard = () => {
    const router = useRouter();
    const [infos, setInfos] = useState<InfoType[]>([]);
    const [projects, setProjects] = useState<ProjectType[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchInfos = async () => {
        try {
            const res = await fetch("/api/get/info");
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to fetch Infos");
            setInfos(data.data);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Unexpected error");
        }
    };

    const fetchProjects = async () => {
        try {
            const res = await fetch("/api/get/projects");
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to fetch Projects");
            setProjects(data.data);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Unexpected error");
        }
    };

    useEffect(() => {
        setLoading(true);
        Promise.all([fetchInfos(), fetchProjects()]).finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading dashboard...</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

            {/* Buttons */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => router.push("/info/new")}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    + Add New Info
                </button>
                <button
                    onClick={() => router.push("/projects/new")}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    + Add New Project
                </button>
            </div>

            {/* Infos List */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Infos</h2>
                {infos.length > 0 ? (
                    <ul className="list-disc pl-5">
                        {infos.map((info) => (
                            <li key={info._id}>
                                <strong>{info.fullname}</strong> — {info.bio} | Contact: {info.contact} | Created at:{" "}
                                {new Date(info.createdAt).toLocaleDateString()}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No Infos found.</p>
                )}
            </div>

            {/* Projects List */}
            <div>
                <h2 className="text-xl font-semibold mb-2">Projects</h2>
                {projects.length > 0 ? (
                    <ul className="list-disc pl-5">
                        {projects.map((project) => (
                            <li key={project._id}>
                                <strong>{project.projectName}</strong> — {project.projectTitle} | Created at:{" "}
                                {new Date(project.createdAt).toLocaleDateString()}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No Projects found.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
