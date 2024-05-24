import { ModuleUID } from './types'

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
		// TODO
		return ''
	}
}
