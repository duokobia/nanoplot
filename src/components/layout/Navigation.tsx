"use client";

import { cx } from "@/utils/cx/cx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Routes } from "@/utils/routes/routes";

type Props = {};

export const Navigation = ({}: Props) => {
	const path = usePathname();
	console.log("path", path);

	return (
		<aside className={"h-screen min-w-[4.5rem] overflow-y-auto p-2 hidden lg:flex flex-col items-center gap-6"}>
			<Link
				href={"/"}
				className="w-fit h-fit p-2 mb-2 text-xl font-serif rounded-full border-4 border-l-pink-500 border-t-red-500 border-r-blue-500 border-b-green-500"
			>
				NP
			</Link>

			{Routes.map((route) => (
				<Link
					key={route.href}
					href={route.href}
					className={cx(
						"hover:[&>svg]:opacity-60 hover:[&>svg]:scale-110",
						path === route.href ? "[&_svg]:opacity-100" : "[&>svg]:opacity-30",
					)}
				>
					<route.icon className="w-8 h-8" />
				</Link>
			))}
		</aside>
	);
};