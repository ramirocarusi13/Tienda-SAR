import { Gantt } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import React, { useState } from "react";

export default function Diagrama() {
    const [tasks, setTasks] = useState([
        {
            id: "1",
            name: "Proyecto A",
            start: new Date(2024, 1, 1),
            end: new Date(2024, 1, 20),
            type: "project",
            progress: 70,
            dependencies: [],
            hideChildren: false,
        },
        {
            id: "1.1",
            name: "Tarea 1",
            start: new Date(2024, 1, 1),
            end: new Date(2024, 1, 10),
            type: "task",
            progress: 50,
            dependencies: ["1"],
            project: "1",
        },
        {
            id: "1.2",
            name: "Tarea 2",
            start: new Date(2024, 1, 11),
            end: new Date(2024, 1, 20),
            type: "task",
            progress: 30,
            dependencies: ["1.1"],
            project: "1",
        },
        {
            id: "2",
            name: "Proyecto B",
            start: new Date(2024, 2, 1),
            end: new Date(2024, 2, 15),
            type: "project",
            progress: 40,
            dependencies: [],
            hideChildren: false,
        },
        {
            id: "2.1",
            name: "Tarea 1",
            start: new Date(2024, 2, 1),
            end: new Date(2024, 2, 5),
            type: "task",
            progress: 20,
            dependencies: ["2"],
            project: "2",
        },
        {
            id: "2.2",
            name: "Tarea 2",
            start: new Date(2024, 2, 6),
            end: new Date(2024, 2, 15),
            type: "task",
            progress: 60,
            dependencies: ["2.1"],
            project: "2",
        },
    ]);

    const handleTaskChange = (task) => {
        const updatedTasks = tasks.map((t) => (t.id === task.id ? task : t));
        setTasks(updatedTasks);
    };

    return (
        <Gantt tasks={tasks} onDateChange={handleTaskChange} />
    )
}
