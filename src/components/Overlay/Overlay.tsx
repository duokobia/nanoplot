import { ReactNode, RefObject } from "react";
import { cx } from "@/utils/cx/cx";
import styles from "./Overlay.module.scss";
import { GraphContext } from "@/hooks/use-graph";

type HTMLElements = keyof React.JSX.IntrinsicElements;
type Props = React.HTMLAttributes<HTMLDivElement> & {
	ref?: RefObject<HTMLDivElement>;
	context?: GraphContext;
	tag: HTMLElements;
};
const Overlay = ({ children, context, ...rest }: Props) => {
	return (
		<div {...rest} className={cx("absolute top-0 left-0 col-[1/-1] row-[1/-1]", rest.className)}>
			{children}
		</div>
	);
};

export const overlay = new Proxy<Record<HTMLElements, (props: Omit<Props, "tag">) => ReactNode>>(Overlay as never, {
	get: function (target, prop: HTMLElements) {
		return ({ children, ...rest }: Omit<Props, "tag">) => {
			return (
				<Overlay {...rest} tag={prop}>
					{children}
				</Overlay>
			);
		};
	},
});
