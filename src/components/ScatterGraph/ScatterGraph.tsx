import { GraphContext } from "@/hooks/use-graph";
import { GraphUtils } from "@/utils/graph/graph";
import { ColorUtils } from "@/utils/color/color";
import { CoordinatesUtils } from "@/utils/coordinates/coordinates";

type Props = {
	context?: GraphContext;
};

export const ScatterGraph = ({ context }: Props) => {
	if (!context) return null;
	const { viewbox } = context;

	if (!GraphUtils.isXYData(context.data)) return null;

	const xForValue = CoordinatesUtils.xCoordinateFor(context);
	const yForValue = CoordinatesUtils.yCoordinateFor(context);

	const dataset = context.data.map((d, i, set) => {
		return {
			id: d.name ?? d.id,
			...d,
			data: d.data.map(({ x, y }) => ({
				x: xForValue(x),
				y: yForValue(y),
			})),
			stroke: d.stroke ?? ColorUtils.colorFor(i, set.length),
		};
	});

	return (
		<svg viewBox={`0 0 ${viewbox.x} ${viewbox.y}`} className={"h-full w-full"}>
			{dataset.map((d, i) => {
				return (
					<path
						key={i}
						d={d.data.map(({ x, y }, i) => `M ${x} ${y} A 0 0 0 0 1 ${x} ${y}`).join(" ")}
						strokeWidth={10}
						stroke={d.stroke}
						strokeLinecap={"round"}
						strokeLinejoin={"round"}
						vectorEffect={"non-scaling-stroke"}
					/>
				);
			})}
		</svg>
	);
};