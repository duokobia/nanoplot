"use client";
import { Graph } from "@/components/Graph/Graph";
import { XAxis } from "@/components/XAxis/XAxis";
import { YAxis } from "@/components/YAxis/YAxis";
import { GridLines } from "@/components/GridLines/GridLines";
import { Bars } from "@/components/Bars/Bars";
import { ComponentProps, useState } from "react";
import { Control } from "@/components/Docs/Control/Control";
import { BooleanControl } from "@/components/Docs/Control/components/BooleanControl/BooleanControl";

export default function Page() {
	const [gridline, setGridline] = useState<ComponentProps<typeof GridLines>>({});
	const setGridPartial = (partial: Partial<ComponentProps<typeof GridLines>>) => setGridline((prev) => ({ ...prev, ...partial }));

	return (
		<div className={"h-full max-h-screen grid grid-cols-[40%_1fr] grid-rows-2 gap-4"}>
			<div className={"row-span-2 h-full border-[1px] border-dotted border-white p-4 bg-gray-100 dark:bg-gray-800"}>
				<h1 className={"text-2xl"}>Bar Graph</h1>
				<Control name={"Border"} type={"boolean"}>
					<BooleanControl
						value={gridline.border}
						onChange={(checked) => setGridPartial({ border: checked })}
						description={"Adds Border To Graph"}
					/>
				</Control>
				<Control name={"Horizontal"} type={"boolean"}>
					<BooleanControl
						value={gridline.horizontal}
						onChange={(checked) => setGridPartial({ horizontal: checked })}
						description={"Adds Horizontal Grid Lines"}
					/>
				</Control>
				<Control name={"Vertical"} type={"boolean"}>
					<BooleanControl
						value={gridline.vertical}
						onChange={(checked) => setGridPartial({ vertical: checked })}
						description={"Adds Vertical Grid Lines"}
					/>
				</Control>
			</div>

			<div className={"border-[1px] h-full border-dotted border-white"}>
				<Graph data={[{ name: "My First Dataset", data: MOCK_DATA }]} gap={{ top: 15, left: 15, right: 30, bottom: 15 }}>
					<YAxis ticks={{ from: 0 }} />
					<GridLines {...gridline} />
					<Bars />
					<XAxis />
				</Graph>
			</div>
			<div className={"border-[1px] border-dotted border-white"}>EXAMPLES</div>
		</div>
	);
}

const MOCK_DATA = [
	{ x: "Jan", y: 57 },
	{ x: "Feb", y: 91 },
	{ x: "Mar", y: 83 },
	{ x: "Apr", y: 74 },
	{ x: "May", y: 51 },
	{ x: "Jun", y: 63 },
	{ x: "Jul", y: 71 },
	{ x: "Aug", y: 73 },
	{ x: "Sep", y: 68 },
	{ x: "Oct", y: 93 },
	{ x: "Nov", y: 84 },
	{ x: "Dec", y: 48 },
];
