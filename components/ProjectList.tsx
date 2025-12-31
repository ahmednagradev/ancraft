// components/ProjectList.tsx
"use client";

import { useState } from "react";
import ProjectForm from "./ProjectForm";

interface ProjectListProps {
	projects: any[];
	onProjectAdded: (project: any) => void;
	onProjectUpdated: (project: any) => void;
	onProjectDeleted: (projectId: string) => void;
}

export default function ProjectList({
	projects,
	onProjectAdded,
	onProjectUpdated,
	onProjectDeleted,
}: ProjectListProps) {
	const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
	const [showNewProjectForm, setShowNewProjectForm] = useState(false);

	return (
		<div className="bg-linear-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-gray-800/50 p-6 sm:p-8 shadow-2xl">
			<div className="flex items-center justify-between gap-3 mb-6 sm:mb-8">
				<div className="flex items-center gap-3">
					<div className="w-1 h-8 bg-linear-to-b from-purple-500 to-purple-600 rounded-full" />
					<h2 className="text-xl sm:text-2xl font-bold text-white">Projects</h2>
					<span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-semibold rounded-full">
						{projects.length}
					</span>
				</div>
			</div>

			{/* Existing Projects */}
			{projects.length > 0 && (
				<div className="space-y-4 mb-6">
					{projects.map((project) => (
						<div key={project._id}>
							{editingProjectId === project._id ? (
								<ProjectForm
									mode="edit"
									initialData={project}
									onSuccess={(updatedProject) => {
										onProjectUpdated(updatedProject);
										setEditingProjectId(null);
									}}
									onCancel={() => setEditingProjectId(null)}
								/>
							) : (
								<div className="group relative bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:border-gray-600/50 transition-all duration-300">
									<div className="flex flex-col sm:flex-row justify-between gap-4">
										{/* Project Info */}
										<div className="flex-1 min-w-0">
											<div className="flex items-start gap-4">
												{project.projectLogo && (
													<div className="relative shrink-0">
														<div className="absolute inset-0 bg-linear-to-br from-purple-500/20 to-blue-500/20 rounded-xl blur-lg" />
														<img
															src={project.projectLogo}
															alt={project.projectName}
															className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border border-gray-700/50"
														/>
													</div>
												)}
												<div className="flex-1 min-w-0">
													<h3 className="text-lg sm:text-xl font-bold text-white mb-1 truncate">
														{project.projectName}
													</h3>
													<p className="text-sm text-gray-400 truncate mb-2">
														{project.projectTitle}
													</p>
													<p className="text-sm text-gray-300 line-clamp-2">
														{project.projectDescription}
													</p>
												</div>
											</div>
										</div>

										{/* Action Buttons */}
										<div className="flex sm:flex-col gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
											<button
												onClick={() => setEditingProjectId(project._id)}
												className="flex-1 sm:flex-none px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium rounded-lg hover:bg-blue-500/20 hover:border-blue-500/30 transition-all duration-300"
											>
												Edit
											</button>
											<button
												onClick={() => {
													if (confirm("Are you sure you want to delete this project?")) {
														onProjectDeleted(project._id);
													}
												}}
												className="flex-1 sm:flex-none px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium rounded-lg hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-300"
											>
												Delete
											</button>
										</div>
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			)}

			{/* Add New Project */}
			{showNewProjectForm ? (
				<ProjectForm
					mode="create"
					onSuccess={(newProject) => {
						onProjectAdded(newProject);
						setShowNewProjectForm(false);
					}}
					onCancel={() => setShowNewProjectForm(false)}
				/>
			) : (
				<button
					onClick={() => setShowNewProjectForm(true)}
					className="group w-full py-6 sm:py-8 border-2 border-dashed border-gray-700/50 rounded-xl sm:rounded-2xl hover:border-purple-500/50 hover:bg-purple-500/5 text-gray-400 hover:text-purple-400 font-medium transition-all duration-300"
				>
					<span className="flex flex-col items-center justify-center gap-3">
						<div className="relative">
							<div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
							<div className="relative w-12 h-12 bg-gray-800/50 border border-gray-700/50 rounded-full flex items-center justify-center group-hover:border-purple-500/30 group-hover:bg-purple-500/10 transition-all duration-300">
								<svg
									className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
								</svg>
							</div>
						</div>
						<span className="text-sm sm:text-base">Add New Project</span>
					</span>
				</button>
			)}
		</div>
	);
}