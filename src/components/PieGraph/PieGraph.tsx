import { useId } from "react";
import { SegmentDataset } from "@/hooks/use-graph";
import { MathUtils } from "@/utils/math/math";
import { PathUtils } from "@/utils/path/path";
import styles from "./PieGraph.module.scss";
import { cx } from "@/utils/cx/cx";
import { ColorUtils } from "@/utils/color/color";

type Props = {
	data: SegmentDataset;
	loading: boolean;
	donut: boolean;
};

const X_SCALE = 3000;
const Y_SCALE = 3000;
const PADDING_PERCENT = 0.8;
export const PieGraph = ({ donut, data, loading }: Props) => {
	const shadowId = useId();
	const gradientId = useId();
	const glowId = useId();

	const PIE_RADIUS = (X_SCALE / (donut ? 2 : 3)) * PADDING_PERCENT;
	const isSinglePie = data.length === 1;
	const total = data.reduce((sum, { value }) => sum + Number(value), 0);

	const dataset = data
		.map((d) => ({ ...d, id: d.name ?? d.name, value: Number(d.value) }))
		.sort((a, b) => b.value - a.value)
		.map((segment, i, segments) => {
			const previousTotalDegrees = segments
				.slice(0, i)
				.map(({ value }) => MathUtils.scale(value, total, 360))
				.reduce((sum, value) => sum + value, 180);
			return {
				...segment,
				previousTotalDegrees,
				degrees: MathUtils.scale(segment.value, total, 360),
			};
		});

	if (loading) {
		return (
			<svg viewBox={`0 0 3000 3000`}>
				<path d={PathUtils.circleArc(X_SCALE / 2, Y_SCALE / 2, PIE_RADIUS)}>
					<animate
						attributeName="fill"
						values="#2d2d2d; #3c3c3c; #2d2d2d; #2d2d2d;"
						dur="2s"
						repeatCount="indefinite"
						calcMode="spline"
						keyTimes="0; 0.3; 0.6; 1"
						keySplines="0.15 0.25 0.25 0.15; 0.15 0.25 0.25 0.15; 0 0 0 0"
					/>
				</path>
				{donut && <path className={styles.center} d={PathUtils.circleArc(X_SCALE / 2, Y_SCALE / 2, PIE_RADIUS * 0.65)} />}
			</svg>
		);
	}
	return (
		<div>
			<svg viewBox={`0 0 ${X_SCALE} ${Y_SCALE}`} role={"img"} height={"100%"} width="100%">
				<defs>
					<filter id={shadowId} filterUnits="userSpaceOnUse">
						<feDropShadow dx="0" dy="-150" stdDeviation="100" floodColor="#000000" floodOpacity="0.4" />
						<feDropShadow dx="0" dy="200" stdDeviation="100" floodColor="#000000" floodOpacity="0.5" />
					</filter>
				</defs>
				<use xlinkHref={`#${glowId}`} filter={"blur(150px)"} opacity={0.5} scale={0.9} />
				<g id={glowId}>
					{dataset
						.map((d, i) => {
							const startLabelLine = PathUtils.polarToCartesian(
								X_SCALE / 2,
								Y_SCALE / 2,
								PIE_RADIUS,
								d.previousTotalDegrees + d.degrees / (isSinglePie ? 0.75 : 2) + 180,
							);

							const collisionPosition = dataset
								.slice(0, i + 1)
								.map((segment) => {
									return {
										name: segment.name,
										position: PathUtils.polarToCartesian(
											X_SCALE / 2,
											Y_SCALE / 2,
											PIE_RADIUS * 1.2,
											segment.previousTotalDegrees + segment.degrees / (isSinglePie ? 0.75 : 2) + 180,
										),
									};
								})
								.filter((segment, i, segments) => {
									if (!segments[i - 1]) return false;
									const COLLISION_THRESHOLD = 0.15; /* 10% */
									const { y, x } = segment.position;
									const { y: nextY, x: nextX } = segments[i - 1].position;
									return (
										MathUtils.isBetween(nextY * (1 - COLLISION_THRESHOLD), nextY * (1 + COLLISION_THRESHOLD), y) &&
										MathUtils.isBetween(nextX * 0.7, nextX * 1.3, x)
									);
								})
								.map((segment) => segment.name)
								.findIndex((str) => d.name === str);

							const isCollisionFlipped = collisionPosition > 4;
							const endLabelLine = PathUtils.polarToCartesian(
								X_SCALE / 2,
								Y_SCALE / 2,
								PIE_RADIUS * (1.2 + 0.1 * ((isCollisionFlipped ? collisionPosition - 4 : collisionPosition) + 1)),
								d.previousTotalDegrees + d.degrees / (isSinglePie ? 0.75 : 2) + 180,
							);
							const isRightAligned = isCollisionFlipped || MathUtils.scale(endLabelLine.x, X_SCALE, 100) > 50;

							const path = (
								<g className={cx(!donut && styles.rotate)} key={i}>
									{!donut && (
										<path
											className={styles.labelPath}
											key={d.name}
											d={`M ${startLabelLine.x} ${startLabelLine.y} L ${endLabelLine.x} ${endLabelLine.y} ${
												isRightAligned ? "l 100 0" : "l -100 0"
											}`}
											// stroke={hovered?.name === d.name ? (d.stroke ?? ColorUtils.colorFor(i)) : "#2D2D2D"}
										/>
									)}
									{!donut && (
										<g className={cx(styles.label, styles.rotate)}>
											<text
												aria-label={`${d.name}-label`}
												y={endLabelLine.y}
												x={endLabelLine.x}
												stroke={d.stroke ?? ColorUtils.colorFor(i)}
												fill={d.stroke ?? ColorUtils.colorFor(i)}
												dx={isRightAligned ? 140 : -140}
												style={{ textAnchor: isRightAligned ? "start" : "end" }}
											>
												<tspan>{d.name.length > 20 ? d.name.slice(0, 20) + "..." : d.name}</tspan>
												<tspan className={styles.percent} dx={25}>
													{+(Math.round(+(((d.value / total) * 100).toFixed(1) + "e+2")) + "e-2")}%
												</tspan>
											</text>
										</g>
									)}
									<path
										className={cx(!donut && styles.segment)}
										d={
											PathUtils.describeArc(
												X_SCALE / 2,
												Y_SCALE / 2,
												PIE_RADIUS,
												d.previousTotalDegrees,
												d.previousTotalDegrees + d.degrees,
											) + ` L ${X_SCALE / 2} ${X_SCALE / 2} Z`
										}
										style={{ color: d.stroke ?? ColorUtils.colorFor(i) }}
										// onMouseEnter={() => setHovered(d)}
										id={d.name}
										// onMouseLeave={() => setHovered(undefined)}
										aria-label={`${d.name}-segment`}
									/>
								</g>
							);
							return {
								name: d.name,
								path,
							};
						})
						// .sort((a) => (a.name === hovered?.name ? 1 : -1))
						.map(({ path }) => path)}
					{dataset.map((d, i) => {
						return (
							<use
								href={`#${d.name}`}
								key={d.name}
								className={cx(!donut && styles.segment, styles.segmentHoverable)}
								stroke={"red"}
								fill={"red"}
							/>
						);
					})}
				</g>
			</svg>
		</div>
	);
};