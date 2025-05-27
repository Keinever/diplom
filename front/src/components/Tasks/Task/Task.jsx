import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import DescriptionTask from "../DescriptionTask/DescriptionTask.jsx"
import BronKerboschLab from "../../Labs/BronKerboschLab.jsx";

export default function Task() {
    const [tabValue, setTabValue] = React.useState(2);

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <div className="">
            <div className="px-8">
                <Tabs
                    centered
                    flexContainer
                    value={tabValue}
                    onChange={handleChange}
                    sx={{
                        '& .MuiTabs-flexContainer': {
                            flexWrap: 'wrap',
                        },
                    }}
                >
                    <Tab value={1} label="Инструкции" />
                    <Tab value={2} label="Задача (Обучение)" />
                    <Tab value={3} label="Задача (Аттестация)" />
                </Tabs>
            </div>
            {tabValue === 1 && <DescriptionTask description="Так бережно разливается по воздуху звук торопливого ручейка, весело бегущего извилистой ленточкой среди травы. Словно играя на арфе, падают росинки с деревьев, перепрыгивают  еле слышно на цветы, а потом беззвучно исчезают в траве. На  поляне жужжат деловые шмели, саранча поет свою незамысловатую песню. То здесь, то там слышно щебетанье птиц.  А тон всему задает тихий шелест ветра. Словно дирижер он руководит журчанием ручья, следит за тональностью росинок и периодически утихомиривает насекомых. Лида лежит на мягкой траве, прикрывая голову от солнца большим листом лопуха, и наслаждается музыкой природы. Она ничего не может слышать уже несколько лет. Ей помогает в этом память." />}
            {tabValue === 2 && <BronKerboschLab></BronKerboschLab>}
            {tabValue === 3 && <BronKerboschLab></BronKerboschLab>}
        </div>
    )
}