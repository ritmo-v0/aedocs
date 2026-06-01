// Types & Interfaces
export type OgImageProps = {
	title: string;
	description?: string;
	logoSrc?: string;
	category?: "expressions" | "scripting" | (string & {});
	site?: React.ReactNode;
};



export function OgImage({
	title,
	description,
	logoSrc,
	category,
	site
}: OgImageProps) {
	const background = "hsl(240, 7%, 11%)";
	const foreground = "hsl(60, 100%, 98%)";
	const primary = "hsl(234, 100%, 83%)";
	const mutedForeground = "hsl(240, 4%, 65%)";

	return (
		<div
			tw="flex flex-col gap-8 w-full h-full p-20"
			style={{
				backgroundColor: background,
				color: foreground,
			}}
		>
			{/* Metadata */}
			<div tw="flex items-center gap-6 text-4xl">
				{logoSrc && (
					<div
						tw="-mr-2 size-14 bg-contain"
						style={{ backgroundImage: `url(${logoSrc})` }}
					/>
				)}
				<span tw="font-semibold" style={{ color: primary }}>{site}</span>
				{category && <>
					<span>{`/`}</span>
					<span tw="capitalize">{category}</span>
				</>}
			</div>

			{/* Title & Description */}
			<div tw="grow flex flex-col justify-end gap-8">
				<h1
					tw="m-0 font-bold text-6xl/[1.1] text-balance text-ellipsis"
					style={{ lineClamp: 2 }}
				>
					{title}
				</h1>
				{description && (
					<p
						tw="m-0 text-4xl/snug text-ellipsis"
						style={{ color: mutedForeground, lineClamp: 3 }}
					>
						{description}
					</p>
				)}
			</div>
		</div>
	);
}