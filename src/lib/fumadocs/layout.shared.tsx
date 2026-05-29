// Types & Interfaces
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

// Constants & Variables
import { APP_NAME, GIT_CONFIG } from "./constants";



export function baseOptions(): BaseLayoutProps {
	return {
		nav: {
			title: APP_NAME,
		},
		githubUrl: `https://github.com/${GIT_CONFIG.user}/${GIT_CONFIG.repo}`,
	};
}