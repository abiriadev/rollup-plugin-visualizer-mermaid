import { match } from 'ts-pattern'

export const indentHelper = (
	lines: Array<string>,
	indent: number = 1,
	tab: string = '\t',
) => lines.map(line => tab.repeat(indent) + line)

export type MermaidNodeStyle =
	| 'default'
	| 'round'
	| 'stadium'
	| 'circle'
	| 'rhombus'
	| 'hexagon'

export const styleMermaidNode = (
	id: string,
	text: string = id,
	style: MermaidNodeStyle = 'default',
) => {
	const quotedText = `"${text}"`

	return `${id}${match(style)
		.with('default', () => `[${quotedText}]`)
		.with('round', () => `(${quotedText})`)
		.with('stadium', () => `([${quotedText}])`)
		.with('circle', () => `((${quotedText}))`)
		.with('rhombus', () => `{${quotedText}}`)
		.with('hexagon', () => `{{${quotedText}}}`)
		.exhaustive()}`
}
