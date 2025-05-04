import {useState} from "react";

const TabContent = ({ title, content }) => (
    <div className="tabcontent">
        <h3>{title}</h3>
        <p>{content}</p>
    </div>
);

export default function LabsPage() {
    const [ active, setActive ] = useState(null);

    const openTab = e => setActive(+e.target.dataset.index);
    const items = [
        { title: 'London', content: 'London is the capital city of England.' },
        { title: 'Paris', content: 'Paris is the capital of France.' },
        { title: 'Tokyo', content: 'Tokyo is the capital of Japan.' },
    ];

    return (
        <div>
            <div className="tab">
                {items.map((n, i) => (
                    <button
                        className={`tablinks ${i === active ? 'active' : ''}`}
                        onClick={openTab}
                        data-index={i}
                    >{n.title}</button>
                ))}
            </div>
            {items[active] && <TabContent {...items[active]} />}
        </div>
    );
}