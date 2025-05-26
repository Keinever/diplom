import { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import BronKerboschRLCP from "../../Rlcp/BronKerboschRLCP.jsx";

const client = new BronKerboschRLCP({
    url: '127.0.0.1:13336',
    proxyUrl: 'http://localhost:3001/rlcp-proxy'
});

const BronKerboschLab = () => {
    const [mvumTable, setMvumTable] = useState([]);
    const [mainTable, setMainTable] = useState([{ id: 1, Sk: [], QkPlus: [], QkMinus: [] }]);
    const [activeCell, setActiveCell] = useState(null);
    const [stabilityNumber, setStabilityNumber] = useState('');
    const [nvumCount, setNvumCount] = useState('');
    const [timeLeft, setTimeLeft] = useState(3600);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const cyRef = useRef(null);
    const containerRef = useRef(null);
    const activeCellRef = useRef(activeCell);
    const timerRef = useRef(null);

    const nodeStyle = {
        'label': 'data(id)',
        'background-color': '#4F46E5',
        'width': 40,
        'height': 40,
        'border-width': 2,
        'border-color': '#3730A3',
        'color': '#fff',
        'text-valign': 'center',
        'text-halign': 'center',
        'font-size': '20px'
    };

    useEffect(() => { activeCellRef.current = activeCell; }, [activeCell]);

    const init = async () => {
        try {
            if (cyRef.current) {
                cyRef.current.destroy();
                cyRef.current = null;
            }

            const response = await client.generate();
            if (!containerRef.current) return;

            const cy = cytoscape({
                container: containerRef.current,
                elements: {
                    nodes: response.graph.nodes.map((n, i) => ({
                        data: {id: n},
                        position: {x: 50 + 100*(i%2), y: 50 + 100*(Math.floor(i/2))}
                    })),
                    edges: response.graph.edges.map(e => ({data: {source: e.source, target: e.target}}))
                },
                style: [
                    {selector: 'node', style: nodeStyle},
                    {selector: 'edge', style: {'width': 2, 'line-color': '#6B7280'}}
                ],
                layout: {name: 'preset'},
                userZoomingEnabled: false
            });

            cy.on('tap', 'node', (e) => {
                const node = e.target;
                const current = activeCellRef.current;
                if (!current) return;

                const update = values =>
                    values.includes(node.id())
                        ? values.filter(v => v !== node.id())
                        : [...values, node.id()];

                current.table === 'main'
                    ? setMainTable(prev => prev.map(row =>
                        row.id === current.rowId ? {...row, [current.column]: update(row[current.column])} : row))
                    : setMvumTable(prev => prev.map((v, i) => i === current.rowId ? update(v) : v));
            });

            cyRef.current = cy;
        } catch (error) {
            console.error('Initialization error:', error);
        }
    };

    const resetState = () => {
        setIsSubmitted(false);
        setMvumTable([]);
        setMainTable([{ id: 1, Sk: [], QkPlus: [], QkMinus: [] }]);
        setActiveCell(null);
        setStabilityNumber('');
        setNvumCount('');
        setTimeLeft(3600);
        clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if(prev <= 1) {
                    clearInterval(timerRef.current);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        init();
    };

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        if (!cyRef.current) return;
        const values = activeCell ? (activeCell.table === 'main'
            ? mainTable.find(r => r.id === activeCell.rowId)?.[activeCell.column] || []
            : mvumTable[activeCell.rowId] || []) : [];

        cyRef.current.nodes().forEach(node => {
            const selected = values.includes(node.id());
            node.style({
                'background-color': selected ? '#10B981' : '#4F46E5',
                'border-color': selected ? '#047857' : '#3730A3'
            });
        });
    }, [activeCell, mainTable, mvumTable]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSubmit = async () => {
        if(isSubmitted) return;

        try {
            const mainTableData = mainTable.map(row =>
                [row.Sk.join(','), row.QkPlus.join(','), row.QkMinus.join(',')]
            ).map(arr => `"${arr.join('","')}"`);

            const dataString = `<!-- line:${mainTable.length} [${mainTableData}] vup:[${mvumTable.map(v => `"${v.join('')}"`)}] numG:${stabilityNumber} countG:${nvumCount} -->`;

            const result = await client.check(dataString);
            const score = result * 100;
            alert(`Результат: ${score.toFixed(1)}%`);
            setIsSubmitted(true);
            clearInterval(timerRef.current);
        } catch(error) {
            console.error('Ошибка проверки:', error);
            alert('Произошла ошибка при проверке');
        }
    };

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if(prev <= 1) {
                    clearInterval(timerRef.current);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, []);

    const toggleCellSelection = (table, rowId, column) => {
        setActiveCell(prev =>
            prev?.table === table && prev?.rowId === rowId && prev?.column === column
                ? null
                : {table, rowId, column});
    };

    const tableActions = {
        addMain: () => setMainTable([...mainTable, {
            id: mainTable.length + 1,
            Sk: [],
            QkPlus: [],
            QkMinus: []
        }]),
        deleteMain: id => setMainTable(mainTable.filter(row => row.id !== id)),
        addMvum: () => setMvumTable([...mvumTable, []]),
        deleteMvum: index => setMvumTable(prev => prev.filter((_, i) => i !== index))
    };

    return (
        <div className="p-6 mx-auto mt-5 bg-white shadow-lg border-2 border-gray-200 rounded-xl"
             style={{width: '95%', maxWidth: '1800px', margin: 'auto'}}>

            <h2 className="text-2xl font-bold mb-6 text-gray-800">Алгоритм Брона-Кербоша</h2>

            <div className="flex flex-wrap gap-6 items-start">
                <div className="flex flex-col flex-1 min-w-[300px]" style={{maxWidth: '500px'}}>
                    <h3 className="text-lg font-semibold mb-3 text-gray-700">Граф</h3>
                    <div ref={containerRef} className="border-2 border-gray-200 rounded-lg bg-gray-50"
                         style={{height: '400px', minHeight: '400px'}} />
                </div>

                <div className="flex flex-col flex-2 min-w-[300px]" style={{flex: '2 1 600px', maxWidth: '800px'}}>
                    <h3 className="text-lg font-semibold mb-3 text-gray-700">Таблица решения</h3>
                    <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 border-r border-b">№</th>
                                <th className="px-4 py-3 border-r border-b">Sk</th>
                                <th className="px-4 py-3 border-r border-b">Qk+</th>
                                <th className="px-4 py-3 border-r border-b">Qk^-</th>
                                <th className="px-4 py-3 border-b"></th>
                            </tr>
                            </thead>
                            <tbody>
                            {mainTable.map((row, index) => (
                                <tr key={row.id} className="hover:bg-gray-50 group">
                                    <td className="px-4 py-2 border-r border-b">{index + 1}</td>
                                    {['Sk', 'QkPlus', 'QkMinus'].map(field => (
                                        <td key={field}
                                            className={`px-4 py-2 border-r border-b cursor-pointer ${
                                                activeCell?.table === 'main' &&
                                                activeCell?.rowId === row.id &&
                                                activeCell?.column === field
                                                    ? 'bg-blue-50 ring-1 ring-blue-300'
                                                    : 'hover:bg-gray-100'
                                            }`}
                                            onClick={() => toggleCellSelection('main', row.id, field)}>
                                            <div className="p-2 rounded">
                                                {row[field].length > 0 ? row[field].join(', ') : '-'}
                                            </div>
                                        </td>
                                    ))}
                                    <td className="px-2 py-2 border-b text-center w-12">
                                        <button onClick={() => tableActions.deleteMain(row.id)}
                                                className="invisible group-hover:visible text-red-500 hover:text-red-700">×</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <button onClick={tableActions.addMain}
                            className="mt-4 self-end px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                        + Добавить строку
                    </button>
                </div>

                <div className="flex flex-col flex-1 min-w-[250px] order-last lg:order-none"
                     style={{flex: '1 1 250px', maxWidth: '350px'}}>
                    <h3 className="text-lg font-semibold mb-3 text-gray-700">МВУМ</h3>
                    <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full">
                            <tbody>
                            {mvumTable.map((values, index) => (
                                <tr key={index}
                                    className="hover:bg-gray-50 group"
                                    onClick={() => toggleCellSelection('mvum', index, null)}>
                                    <td className="px-4 py-2 border-r border-b">{index + 1}.</td>
                                    <td className="px-4 py-2 border-b">
                                        <div className={`p-2 rounded ${
                                            activeCell?.table === 'mvum' &&
                                            activeCell?.rowId === index
                                                ? 'bg-blue-50 ring-1 ring-blue-300'
                                                : ''}`}>
                                            {values.length > 0 ? values.join(', ') : '-'}
                                        </div>
                                    </td>
                                    <td className="px-2 py-2 border-b text-center w-12">
                                        <button onClick={(e) => {
                                            e.stopPropagation();
                                            tableActions.deleteMvum(index);
                                        }}
                                                className="invisible group-hover:visible text-red-500 hover:text-red-700">×</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <button onClick={tableActions.addMvum}
                            className="mt-4 self-end px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                        + Добавить МВУМ
                    </button>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1 text-gray-700">Число внутренней устойчивости:</label>
                    <input type="number" value={stabilityNumber}
                           onChange={e => setStabilityNumber(e.target.value)}
                           className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1 text-gray-700">Количество НВУМ:</label>
                    <input type="number" value={nvumCount}
                           onChange={e => setNvumCount(e.target.value)}
                           className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500" />
                </div>
            </div>

            <div className="mt-6 flex justify-end items-center  mx-auto">
                <div className="flex items-center gap-4">
                    <button
                        onClick={isSubmitted ? resetState : handleSubmit}
                        className={`px-6 py-2 rounded font-medium ${
                            isSubmitted
                                ? 'bg-gray-600 hover:bg-gray-700'
                                : 'bg-green-600 hover:bg-green-700'
                        } text-white transition-colors`}
                    >
                        {isSubmitted ? 'Начать заново' : 'Отправить'}
                    </button>
                    <span className="text-gray-600 font-medium">
                        Времени осталось: {formatTime(timeLeft)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default BronKerboschLab;