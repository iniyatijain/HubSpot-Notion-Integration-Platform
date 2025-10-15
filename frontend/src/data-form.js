import { useState } from 'react';
import {
    Box,
    TextField,
    Button,
} from '@mui/material';
import axios from 'axios';

const endpointMapping = {
    'Notion': 'notion',
    'Airtable': 'airtable',
    'HubSpot': 'hubspot'
};

export const DataForm = ({ integrationType, credentials }) => {
    const [loadedData, setLoadedData] = useState(null);
    const endpoint = endpointMapping[integrationType];

    const handleLoad = async () => {
        try {
            const formData = new FormData();
            formData.append('credentials', JSON.stringify(credentials));
            //console.log("credentials:", credentials);
            const response = await axios.post(`http://localhost:8000/integrations/${endpoint}/get_hubspot_items`, formData);
            const data = response.data;
            setLoadedData(data);
        } catch (e) {
    console.error("Error loading data:", e);  
    alert(e?.response?.data?.detail || "An unexpected error occurred. Check console for details.");
}
    }

    return (
        <Box display='flex' justifyContent='center' alignItems='center' flexDirection='column' width='100%'>
            <Box display='flex' flexDirection='column' width='100%'>
                <TextField
    label="Loaded Data"
    value={loadedData ? JSON.stringify(loadedData, null, 2) : ''}
    multiline
    minRows={6}
    sx={{ mt: 2 }}
    InputLabelProps={{ shrink: true }}
    disabled
/>
                <Button
                    onClick={handleLoad}
                    sx={{mt: 2}}
                    variant='contained'
                >
                    Load Data
                </Button>
                <Button
                    onClick={() => setLoadedData(null)}
                    sx={{mt: 1}}
                    variant='contained'
                >
                    Clear Data
                </Button>
            </Box>
        </Box>
    );
}
