import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Login from "./Login/Login.jsx";
import Register from "./Register/Register.jsx";

export default function LoginRegister() {
    const [tabValue, setTabValue] = React.useState(1);

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <div className="border-2 bg-white my-4">
            <Box className="px-10">
                <Tabs
                    centered
                    flexContainer
                    value={tabValue}
                    onChange={handleChange}
                    textColor="primary"
                    sx={{
                        '& .MuiTabs-flexContainer': {
                            flexWrap: 'wrap',
                        },
                    }}
                >
                    <Tab value={1} label="Вход" />
                    <Tab value={2} label="Регистрация" />
                </Tabs>
            </Box>
            {tabValue === 1 && <Login />}
            {tabValue === 2 && <Register />}
        </div>
    )
}