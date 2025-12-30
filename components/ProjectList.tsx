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
  // Track which project is being edited (null = none, "new" = creating new)
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);

  return (
    <div className="border rounded-lg p-6 space-y-4">
      <h2 className="text-xl font-semibold">Projects</h2>

      {/* Display existing projects */}
      {projects.length > 0 && (
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project._id} className="border rounded-lg p-4">
              {editingProjectId === project._id ? (
                // Show edit form
                <ProjectForm
                  mode="edit"
                  initialData={project}
                  onSuccess={(updatedProject: any) => {
                    onProjectUpdated(updatedProject);
                    setEditingProjectId(null);
                  }}
                  onCancel={() => setEditingProjectId(null)}
                />
              ) : (
                // Show project details
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{project.projectName}</h3>
                      <p className="text-sm text-gray-600">{project.projectTitle}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingProjectId(project._id)}
                        className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Delete this project?")) {
                            onProjectDeleted(project._id);
                          }
                        }}
                        className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {project.projectDescription}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add New Project Button / Form */}
      {showNewProjectForm ? (
        <ProjectForm
          mode="create"
          onSuccess={(newProject: any) => {
            onProjectAdded(newProject);
            setShowNewProjectForm(false);
          }}
          onCancel={() => setShowNewProjectForm(false)}
        />
      ) : (
        <button
          onClick={() => setShowNewProjectForm(true)}
          className="w-full py-3 border-2 border-dashed rounded-lg hover:bg-gray-50 text-gray-600"
        >
          + Add Project
        </button>
      )}
    </div>
  );
}