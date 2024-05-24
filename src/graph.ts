import { match } from 'ts-pattern'
import { ModuleUID } from './types.js'
import { indentHelper } from './utils.js'
import {
	MermaidNodeStyle,
	styleMermaidNode,
} from './mermaid.js'

export type NodeType =
	| 'chunk'
	| 'asset'
	| 'virtual'
	| 'external'
	| 'entry'

export interface Node {
	fileName: string
	type: NodeType
	imports: Array<ModuleUID>
}

const nodeType2Style = (type: NodeType) =>
	match<NodeType, MermaidNodeStyle>(type)
		.with('chunk', () => ({
			shape: 'round',
		}))
		.with('asset', () => ({
			shape: 'round',
		}))
		.with('virtual', () => ({
			color: ['#db7070', '#ffebeb'],
			shape: 'round',
		}))
		.with('external', () => ({
			color: ['#70db79', '#ebffec'],
			shape: 'round',
		}))
		.with('entry', () => ({
			shape: 'hexagon',
		}))
		.exhaustive()

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

		this.#nodes.forEach(
			({ fileName, type }, id) =>
				(lines = lines.concat(
					styleMermaidNode(
						id,
						fileName!,
						nodeType2Style(type!),
					),
				)),
		)

		this.#nodes.forEach(
			({ imports }, id) =>
				void (lines = lines.concat(
					imports!.map(
						importedId =>
							`${id} --> ${importedId}`,
					),
				)),
		)

		lines = indentHelper(lines)

		lines.unshift('flowchart LR')

		return lines.join('\n')
	}
}
