import { useEffect, useState } from "react";
import {
	ProjectModel,
	listProject,
	createProject,
} from "./database";

export const App = () => {
	const [count, setCount] = useState(0);
	const [name, setName] = useState("");

	useEffect(() => {
		createProject({
			id: count,
			name,
			description: "",
		});
	}, [count]);

	const [projects, setProjects] = useState<
		ProjectModel[]
	>([]);

	useEffect(() => {
		const getProjects = async () => {
			setProjects(await listProject());
		};
		getProjects();
	}, []);

	return (
		<>
			<input
				type="text"
				value={name}
				onChange={(event) => {
					setName(event.target.value);
				}}
			></input>
			<button onClick={() => setCount(count + 1)}>
				count is {count}
			</button>
			<button
				onClick={async () => {
					setProjects(await listProject());
					console.log(await listProject());
				}}
			>
				reload
			</button>
			{projects.map(({ name }, index) => {
				return (
					<div key={`p-${index}`}>{name}</div>
				);
			})}
		</>
	);
};
