import { match } from 'ts-pattern'
import { ModuleUID } from './types.js'
import {
	MermaidNodeStyle,
	indentHelper,
	mermaidLink,
	styleMermaidNode,
} from './utils.js'

export interface Node {
	fileName: string
	type:
		| 'chunk'
		| 'asset'
		| 'virtual'
		| 'external'
		| 'entry'
	imports: Array<ModuleUID>
}

// Directed, possibly cyclic dependency graph
export class Graph {
	#nodes: Map<ModuleUID, Partial<Node>> = new Map()

	addNode(id: ModuleUID, node: Partial<Node>) {
		this.#nodes.set(id, node)
	}

	addLink(from: ModuleUID, to: ModuleUID) {
		// Create new node if it doesn't exist
		if (!this.#nodes.has(from))
			this.#nodes.set(from, { imports: [] })

		const node = this.#nodes.get(from) as Partial<Node>

		// Ensure that `imports` field exists
		node.imports ??= []

		// Check if the node already imports the target
		if (!node?.imports?.includes(to))
			node.imports.push(from)
	}

	toJson(): Record<ModuleUID, Partial<Node>> {
		return Object.fromEntries(this.#nodes)
	}

	renderMermaid(): string {
		let lines: Array<string> = []

		this.#nodes.forEach(({ fileName, type }, id) => {
			lines.push(
				styleMermaidNode(
					id,
					fileName!,
					match<Node['type'], MermaidNodeStyle>(
						type!,
					)
						.with('entry', () => 'rhombus')
						.with('chunk', () => 'round')
						.with('virtual', () => 'stadium')
						.with('external', () => 'hexagon')
						.otherwise(() => 'default'),
				),
			)
		})

		this.#nodes.forEach(({ imports }, id) => {
			imports?.forEach(importedId => {
				lines.push(`${id} --> ${importedId}`)
			})
		})

		lines = indentHelper(lines)

		lines.unshift('flowchart LR')

		return lines.join('\n')
	}
}
