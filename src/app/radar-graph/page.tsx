"use client";
import { PieGraph } from "@/components/PieGraph/PieGraph";
import { Graph } from "@/components/Graph/Graph";
import { BooleanControl } from "@/components/Docs/Control/components/BooleanControl/BooleanControl";
import { Control } from "@/components/Docs/Control/Control";
import { ComponentProps, useState } from "react";
import { Radar } from "@/components/Radar/Radar";

export default function Page() {
	const [radar, setRadar] = useState<ComponentProps<typeof Radar>>({
		loading: false,
	});
	const setRadarPartial = (partial: Partial<ComponentProps<typeof PieGraph>>) => setRadar((prev) => ({ ...prev, ...partial }));
	return (
		<div className={"h-full max-h-screen grid grid-cols-[40%_1fr] grid-rows-2 gap-4"}>
			<div className={"row-span-2 h-full border-[1px] border-dotted border-foreground"}>
				<Control name={"loading"} type={"boolean"}>
					<BooleanControl
						value={radar.loading}
						onChange={(loading) => setRadarPartial({ loading })}
						description={"Renders loading skeleton placeholder"}
					/>
				</Control>
			</div>
			<div className={"border-[1px] h-full border-dotted border-foreground"}>
				<Graph  gap={{ top: 30 }} data={[
					{ name: "Demand", value: 70 },
					{ name: "Travelability", value: 8 },
					{ name: "Franchisability", value: 300 },
					{ name: "Momentum", value: 90 },
					{ name: "Longevity", value: 60 },
					{ name: "Reach", value: 65 },
				]}>
					<Radar {...radar} />
				</Graph>
			</div>
			<div className={"border-[1px] border-dotted border-foreground"}>EXAMPLES</div>
		</div>
	);
}

const MOCK_DATA = [
	{
		name: "python",
		value: 283,
	},
	{
		name: "elixir",
		value: 333,
	},
	{
		name: "stylus",
		value: 257,
	},
	{
		name: "css",
		value: 30,
	},
	{
		name: "haskell",
		value: 192,
	},
];
