"use client";
import { Pie } from "@/components/Pie/Pie";
import { Graph } from "@/components/Graph/Graph";
import { BooleanControl } from "@/components/Docs/Control/components/BooleanControl/BooleanControl";
import { HTMLControl } from "@/components/Docs/Control/components/HTMLControl/HTMLControl";
import { Control } from "@/components/Docs/Control/Control";
import { ComponentProps, useState } from "react";
import { Legend } from "@/components/Legend/Legend";

export default function Page() {
	const [pie, setPie] = useState<ComponentProps<typeof Pie>>({
		loading: false,
		donut: false,
		labels: true,
		children: "",
	});
	const setPiePartial = (partial: Partial<ComponentProps<typeof Pie>>) => setPie((prev) => ({ ...prev, ...partial }));
	return (
		<div className={"h-full max-h-screen grid grid-cols-[40%_1fr] grid-rows-2 gap-4"}>
			<div className={"row-span-2 h-full border-[1px] border-dotted border-[hsl(0deg,0%,0%)] dark:border-[hsl(0deg,0%,100%)]"}>
				<Control name={"loading"} type={"boolean"}>
					<BooleanControl
						value={pie.loading}
						onChange={(loading) => setPiePartial({ loading })}
						description={"Renders loading skeleton placeholder"}
					/>
				</Control>
				<Control name={"donut"} type={"boolean"}>
					<BooleanControl
						value={pie.donut}
						onChange={(donut) => setPiePartial({ donut })}
						description={"Renders a donut chart instead of a pie chart"}
					/>
				</Control>
				<Control name={"labels"} type={"boolean"} default={"true"}>
					<BooleanControl
						value={Boolean(pie.labels)}
						onChange={(labels) => setPiePartial({ labels })}
						description={"Renders labels on the pie chart"}
					/>
				</Control>
				<Control name="children" type="ReactNode">
					<HTMLControl html={pie.children?.toString() ?? ""} onChange={(children) => setPiePartial({ children })} />
				</Control>
			</div>
			<div className={"border-[1px] h-full border-dotted border-[hsl(0deg,0%,0%)] dark:border-[hsl(0deg,0%,100%)]"}>
				<Graph data={MOCK_DATA} gap={{ top: 30 }}>
					<Legend position={"top"} alignment={"center"} />
					<Pie {...pie}>{pie.children && <div dangerouslySetInnerHTML={{ __html: pie.children.toString() ?? "" }} />}</Pie>
				</Graph>
			</div>
			<div className={"border-[1px] border-dotted border-[hsl(0deg,0%,0%)] dark:border-[hsl(0deg,0%,100%)]"}>EXAMPLES</div>
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
