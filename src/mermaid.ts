import { match, P } from 'ts-pattern'

export interface MermaidNodeStyle {
	color?: [string, string]
	shape: MermaidNodeShape
}

export type MermaidNodeShape =
	| 'default'
	| 'round'
	| 'stadium'
	| 'circle'
	| 'rhombus'
	| 'hexagon'

export const styleMermaidNode = (
	id: string,
	text: string = id,
	{ color, shape }: Partial<MermaidNodeStyle> = {},
) => {
	const quotedText = `"${text}"`

	const lines = [
		`${id}${match(shape)
			.with(
				P.union('default', undefined),
				() => `[${quotedText}]`,
			)
			.with('round', () => `(${quotedText})`)
			.with('stadium', () => `([${quotedText}])`)
			.with('circle', () => `((${quotedText}))`)
			.with('rhombus', () => `{${quotedText}}`)
			.with('hexagon', () => `{{${quotedText}}}`)
			.exhaustive()}`,
	]

	if (color)
		lines.push(
			`style ${id} stroke:${color[0]},fill:${color[1]}`,
		)

	return lines
}
