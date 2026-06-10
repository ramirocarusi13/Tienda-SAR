import "gantt-task-react/dist/index.css";
import React, { useEffect } from "react";
import Diagrama from "../components/Gantt/Diagrama";
import { FaPlus } from "react-icons/fa6";
import { useState } from "react";
import ModalAddProject from "../components/Gantt/ModalAddProject";

const projectTitle = "Plan de trabajo de sistemas"

export default function GanttPage() {
    const [isOpenModalProject, setIsModalOpenProject] = useState(false)

    useEffect(() => {
        document.title = "Gantt"
    }, [])

    return (
        <div className="p-4">
            <div className="flex items-center gap-4 justify-start mb-4">
                <h2 className="text-xl font-bold">{projectTitle}</h2>

                <div className="flex items-center gap-2">
                    <button onClick={() => setIsModalOpenProject(true)} className="py-1 text-sm bg-orange-700 text-white flex items-center gap-2"><FaPlus />Agregar proyecto</button>
                    <button className="py-1 text-sm bg-green-500 text-white flex items-center gap-2"><FaPlus />Agregar tarea</button>
                </div>
            </div>

            <ModalAddProject isOpen={isOpenModalProject} setIsOpen={setIsModalOpenProject} />
            <Diagrama />
        </div>
    );
}
