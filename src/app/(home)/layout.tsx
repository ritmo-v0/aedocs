// Components & UI
import { HomeLayout } from "fumadocs-ui/layouts/home";

// Constants & Variables
import { baseOptions } from "@/lib/fumadocs/layout.shared";



export default function Layout({ children }: LayoutProps<"/">) {
	return (
		<HomeLayout
			{...baseOptions()}
			links={[
				{
					text: "Docs",
					url: "/docs",
				},
			]}
		>
			{children}
		</HomeLayout>
	);
}