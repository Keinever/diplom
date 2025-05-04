import { useState } from 'react';

export default function GraphVisualizer() {
    const [graphData] = useState({
        nodes: [
            { id: 'A', name: 'A', x: 150, y: 50 },
            { id: 'B', name: 'B', x: 50, y: 150 },
            { id: 'C', name: 'C', x: 250, y: 150 },
            { id: 'D', name: 'D', x: 150, y: 250 },
        ],
        links: [
            { source: 'A', target: 'B' },
            { source: 'A', target: 'C' },
            { source: 'B', target: 'C' },
            { source: 'B', target: 'D' },
            { source: 'C', target: 'D' },
            { source: 'D', target: 'A' },
        ]
    });

    return (
        <div className="relative w-[300px] h-[300px] border-2 border-gray-200">
            {/* Рендерим связи */}
            <svg className="w-full h-full absolute inset-0">
                {graphData.links.map((link, i) => {
                    const sourceNode = graphData.nodes.find(n => n.id === link.source);
                    const targetNode = graphData.nodes.find(n => n.id === link.target);

                    return (
                        <line
                            key={i}
                            x1={sourceNode.x}
                            y1={sourceNode.y}
                            x2={targetNode.x}
                            y2={targetNode.y}
                            stroke="#666"
                            strokeWidth="2"
                        />
                    );
                })}
            </svg>

            {/* Рендерим узлы */}
            {graphData.nodes.map((node) => (
                <div
                    key={node.id}
                    className="absolute w-8 h-8 bg-blue-500 rounded-full text-white
                     flex items-center justify-center text-sm font-bold cursor-pointer"
                    style={{
                        left: node.x,
                        top: node.y,
                        transform: 'translate(-50%, -50%)' // Центрируем элемент относительно координат
                    }}
                >
                    {node.name}
                </div>
            ))}
        </div>
    );
}