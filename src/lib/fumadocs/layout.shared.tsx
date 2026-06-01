// Types & Interfaces
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

// Constants & Variables
import { APP_NAME } from "@/lib/seo/constants";
import { GIT_CONFIG } from "./constants";



export function baseOptions(): BaseLayoutProps {
	return {
		nav: {
			title: (
				<>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 96 96"
						className="size-6"
						aria-hidden="true"
					>
						<rect
							className="fill-fd-primary/10"
							x="0" y="0"
							width="96" height="96"
							rx="24" ry="24"
						/>
						<path
							className="fill-fd-primary"
							d="m53.893,47.183l11.603-17.866c.648-.998-.066-2.317-1.255-2.317-7.015,0-25.465,0-32.48,0-1.19,0-1.906,1.315-1.258,2.313,3.016,4.645,9.687,14.916,11.608,17.875.323.497.323,1.128,0,1.625-1.922,2.959-8.592,13.23-11.608,17.875-.648.998.068,2.313,1.258,2.313,7.015,0,25.465,0,32.48,0,1.19,0,1.906-1.315,1.258-2.313-3.016-4.645-9.687-14.916-11.608-17.875-.323-.497-.32-1.133.003-1.629Z"
						/>
					</svg>
					<span>{APP_NAME}</span>
				</>
			),
		},
		githubUrl: `https://github.com/${GIT_CONFIG.user}/${GIT_CONFIG.repo}`,
	};
}