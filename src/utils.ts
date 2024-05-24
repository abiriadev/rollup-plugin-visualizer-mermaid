export const indentHelper = (
	lines: Array<string>,
	indent: number = 1,
	tab: string = '\t',
) => lines.map(line => tab.repeat(indent) + line)
