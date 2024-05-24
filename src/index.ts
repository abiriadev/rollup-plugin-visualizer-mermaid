#!/usr/bin/env node

import { argv } from 'node:process'
import { readFile } from 'node:fs/promises'
import { VisualizerData } from './types.js'
import { Graph } from './graph.js'

const file = argv[2]

const data = JSON.parse(
	(await readFile(file)).toString(),
) as VisualizerData

const graph = new Graph()

Object.entries(data.nodeMetas).forEach(
	([
		id,
		{ id: fileName, isEntry, isExternal, imported },
	]) => {
		graph.addNode(id, {
			fileName,
			type: isEntry
				? 'entry'
				: isExternal
					? 'external'
					: 'chunk',
			imports: imported.map(({ uid }) => uid),
		})
	},
)

console.log(graph.toJson())
