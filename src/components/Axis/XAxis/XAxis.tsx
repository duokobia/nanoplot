import { Graph } from "@/components/Graph/Graph";
import { GraphContext } from "@/hooks/use-graph";
import { MathUtils } from "@/utils/math/math";
import React from "react";

type Props = {
	context?: GraphContext;
};

export const XAxis = ({ context }: Props) => {
	return (
		<Graph.Row className={"flex items-center"}>
			{context?.domain.x.map((dp, i) => {
				const left = MathUtils.scale(dp.coordinate, 3000, 95);
				return (
					<React.Fragment key={i}>
						<div className={"absolute transform translate-x-1/2"} style={{ left: `${left + 5}%` }}>
							{typeof dp.tick === "number" ? dp.tick.toFixed(2) : dp.tick.toString()}
						</div>
						<div className={"opacity-0"}>{typeof dp.tick === "number" ? dp.tick.toFixed(2) : dp.tick.toString()}</div>
					</React.Fragment>
				);
			})}
		</Graph.Row>
	);
};

XAxis.context = (ctx: GraphContext, props: Props) => {
	return {
		...ctx,
		layout: {
			...ctx.layout,
			rows: ctx.layout.rows + " min-content",
			columns: ctx.layout.columns,
		},
	};
};
