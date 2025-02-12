/*
	{from: 0}
	{from: 0, to: 100}
	{from: 0, to: 100, jumps: 10}
	{from: 0, to: 100, jumps: 10, format: (x) => x.toFixed(2)}
	{from: "min", to: "max", jumps: 5}
	{from: "min", to: "max + 10%", jumps: 5, rounding: "whole"}
	{from: "min", to: "max", jumps: "1 month"}
	{from: "min - 10%", to: "max + 10%" jumps: "1 month"}
 */
import { XAxis } from "@/components/XAxis/XAxis";
import { ComponentProps } from "react";
import { GraphContext } from "@/hooks/use-graph/use-graph";
import { GraphUtils } from "@/utils/graph/graph";
import { MathUtils } from "@/utils/math/math";
import { YAxis } from "@/components/YAxis/YAxis";

const roundUp = (num: number, nearest: number) => Math.ceil(num / nearest) * nearest;
const roundDown = (num: number, nearest: number) => Math.floor(num / nearest) * nearest;
export const DomainUtils = {
	autoMinFor: (value: number) => {
		if (value >= 0) return 0;
		const digits = Math.round(value).toString().length;
		const min = (() => {
			const suggested = -parseInt("1" + "0".repeat(Math.max(0, digits - 1)));
			if ((roundUp(value, suggested) - value) / value > 0.35) {
				// increase is too large from original number.
				return parseInt("1" + "0".repeat(Math.max(0, digits - 2)));
			}
			if (suggested === value) return value - parseInt("1" + "0".repeat(Math.max(0, digits - 2)));
			return suggested;
		})();
		/* Prime number avoid er */
		return roundDown(roundDown(value, min), parseInt("2" + "0".repeat(Math.max(0, digits - 2))));
	},
	autoMaxFor: (value: number) => {
		const digits = Math.round(value).toString().length;
		const max = (() => {
			const suggested = parseInt("1" + "0".repeat(Math.max(0, digits - 1)));
			if ((roundUp(value, suggested) - value) / value > 0.35) {
				// increase is too large from original number.
				return parseInt("1" + "0".repeat(Math.max(0, digits - 2)));
			}
			if (suggested === value) return value + parseInt("1" + "0".repeat(Math.max(0, digits - 2)));
			return suggested;
		})();
		return roundUp(roundUp(value, max), parseInt("2" + "0".repeat(Math.max(0, digits - 2)))); /* Prime number avoider */
	},
	x: {
		ticks: (
			{ data, viewbox }: Pick<GraphContext, "data" | "viewbox">,
			{ from = "auto", to = "auto", jumps = "auto" }: ComponentProps<typeof XAxis>["ticks"] = {
				from: "auto",
				to: "auto",
				jumps: "auto",
			},
		) => {
			if (!GraphUtils.isXYData(data) || data.length === 0) return [];

			const isDistinctValues =
				new Set(data.flatMap((line) => line.data.map((d) => +d.x))).size <= 11 && from === "auto" && to === "auto";
			if (typeof data[0]?.data?.[0].x === "string" /* categorical dataset */ || isDistinctValues) {
				const isCategoricalStrings = typeof data[0]?.data?.[0].x === "string";
				const xValues = Array.from(new Set(data.flatMap((line) => line.data.map((d) => d.x))));
				const tickWidth = viewbox.x / xValues.length;
				if (isCategoricalStrings) {
					return xValues.map((tick, i) => ({
						tick,
						coordinate: i * tickWidth + tickWidth / 2,
					}));
				}
				return xValues.map((tick, i) => ({
					tick,
					coordinate: MathUtils.scale(i, [0, xValues.length - 1], [0, viewbox.x]),
				}));
			}

			const min = Math.min(...data.flatMap((line) => line.data.map((d) => +d.x)));
			const max = Math.max(...data.flatMap((line) => line.data.map((d) => +d.x)));
			if (min === max) return [{ tick: min, coordinate: viewbox.x }];
			if (typeof jumps === "string" && jumps !== "auto") {
				/* datetime un-implemented */
				return [];
			}
			const MIN = (() => {
				if (from === "auto") return DomainUtils.autoMinFor(min);
				if (from === "min") return min;
				if (typeof from === "number") return from;
				const operator = from.match(/(\+|-)/)?.[0];
				const isPercentage = from.includes("%");
				const value = +from.replace(/[^0-9]/g, "");
				if (operator === "+") return isPercentage ? min + (min * value) / 100 : min + value;
				if (operator === "-") return isPercentage ? min - (min * value) / 100 : min - value;
				return min;
			})();
			const MAX = (() => {
				if (to === "auto") return DomainUtils.autoMaxFor(max);
				if (to === "max") return max;
				if (typeof to === "number") return to;
				const operator = to.match(/(\+|-)/)?.[0];
				const isPercentage = to.includes("%");
				const value = +to.replace(/[^0-9]/g, "");
				if (operator === "+") return isPercentage ? max + (max * value) / 100 : max + value;
				if (operator === "-") return isPercentage ? max - (max * value) / 100 : max - value;
				return max;
			})();
			const JUMPS = (() => {
				const distance = MAX - MIN;
				if (jumps === "auto") {
					/* pick number of jumps that doesn't result in a 'tick' being a decimal value if possible */
					return ([6, 7, 8, 9, 5, 4, 10, 11].find((jump) => distance % jump === 0) ?? 9) + 1;
				}
				return jumps;
			})();

			return Array.from({ length: JUMPS }, (_, i) => ({
				tick: MathUtils.scale(i, [0, JUMPS - 1], [MIN, MAX]),
				coordinate: MathUtils.scale(i, [0, JUMPS - 1], [0, viewbox.x]),
			}));
		},
	},
	y: {
		ticks: (
			{ data, viewbox }: Pick<GraphContext, "data" | "viewbox">,
			{ from = "auto", to = "auto", jumps = "auto" }: ComponentProps<typeof YAxis>["ticks"] = {
				from: "auto",
				to: "auto",
				jumps: "auto",
			},
		) => {
			if (!GraphUtils.isXYData(data) || data.length === 0) return [];
			const min = Math.min(...data.flatMap((line) => line.data.map((d) => +d.y)));
			const max = Math.max(...data.flatMap((line) => line.data.map((d) => +d.y)));
			if (min === max) return [{ tick: min, coordinate: viewbox.y / 2 }];

			if (typeof data[0]?.data?.[0].y === "string" /* categorical dataset */) {
				const yValues = Array.from(new Set(data.flatMap((line) => line.data.map((d) => d.y))));
				const tickWidth = viewbox.y / yValues.length;
				return yValues.map((tick, i) => ({
					tick,
					coordinate: i * tickWidth + tickWidth / 2,
				}));
			}

			if (typeof jumps === "string" && jumps !== "auto" /* datetime un-implemented */) {
				return [];
			}

			const MIN = (() => {
				if (from === "auto") return DomainUtils.autoMinFor(min);
				if (from === "min") return min;
				if (typeof from === "number") return from;
				const operator = from.match(/(\+|-)/)?.[0];
				const isPercentage = from.includes("%");
				const value = +from.replace(/[^0-9]/g, "");
				if (operator === "+") return isPercentage ? min + (min * value) / 100 : min + value;
				if (operator === "-") return isPercentage ? min - (min * value) / 100 : min - value;
				return min;
			})();
			const MAX = (() => {
				if (to === "auto") return DomainUtils.autoMaxFor(max);
				if (to === "max") return max;
				if (typeof to === "number") return to;
				const operator = to.match(/(\+|-)/)?.[0];
				const isPercentage = to.includes("%");
				const value = +to.replace(/[^0-9]/g, "");
				if (operator === "+") return isPercentage ? max + (max * value) / 100 : max + value;
				if (operator === "-") return isPercentage ? max - (max * value) / 100 : max - value;
				return max;
			})();
			const JUMPS = (() => {
				const distance = MAX - MIN;
				if (jumps === "auto") {
					return ([6, 7, 8, 9, 5, 4, 10, 11].find((jump) => distance % jump === 0) ?? 9) + 1;
				}
				return jumps;
			})();
			return Array.from({ length: JUMPS }, (_, i) => ({
				tick: MathUtils.scale(i, [0, JUMPS - 1], [MIN, MAX]),
				coordinate: MathUtils.scale(i, [0, JUMPS - 1], [viewbox.y, 0]),
			}));
		},
	},
};
