import { WorldmapIcon, PieGraphIcon, ScatterGraphIcon, LineGraphIcon, BarGraphIcon } from "@/assets/icons";
import { RadarChartIcon } from "@/assets/icons/RadarChartIcon";

export const Routes = [
	{
		name: "Worldmap",
		href: "/worldmap",
		icon: WorldmapIcon,
	},
	{
		name: "Pie Graph",
		href: "/pie-graph",
		icon: PieGraphIcon,
	},
	{
		name: "Scatter Graph",
		href: "/scatter-graph",
		icon: ScatterGraphIcon,
	},
	{
		name: "Line Graph",
		href: "/line-graph",
		icon: LineGraphIcon,
	},
	{
		name: "Radar Graph",
		href: "/radar-graph",
		icon: RadarChartIcon,
	},
	{
		name: "Bar Graph",
		href: "/bar-graph",
		icon: BarGraphIcon,
	},
	{
		name: "Sunburst",
		href: "/sunburst-graph",
		icon: LineGraphIcon,
	},
];
