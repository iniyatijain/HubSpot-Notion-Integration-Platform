import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    CircularProgress
} from '@mui/material';
import axios from 'axios';

export const HubspotIntegration = ({ user, org, integrationParams, setIntegrationParams }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);

    const handleConnectClick = async () => {
        try {
            setIsConnecting(true);
            const formData = new FormData();
            formData.append('user_id', user);
            formData.append('org_id', org);

            const response = await axios.post(`http://localhost:8000/integrations/hubspot/authorize`, formData);
            const authURL = response?.data;

            const newWindow = window.open(authURL, 'HubSpot Authorization', 'width=600, height=600');

            const pollTimer = window.setInterval(() => {
                if (newWindow?.closed) {
                    window.clearInterval(pollTimer);
                    handleWindowClosed();
                }
            }, 500);
        } catch (e) {
            setIsConnecting(false);
            alert(e?.response?.data?.detail || 'Authorization failed. Check console.');
            console.error(e);
        }
    };

    const handleWindowClosed = async () => {
        try {
            const formData = new FormData();
            formData.append('user_id', user);
            formData.append('org_id', org);

            const response = await axios.post(`http://localhost:8000/integrations/hubspot/credentials`, formData);
            const credentials = response.data;

            if (credentials) {
                setIsConnected(true);
                setIntegrationParams(prev => ({ ...prev, credentials, type: 'HubSpot' }));
            }
        } catch (e) {
            alert(e?.response?.data?.detail || 'Could not fetch credentials. Check console.');
            console.error(e);
        } finally {
            setIsConnecting(false);
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');

        if (code) {
            (async () => {
                try {
                    const formData = new FormData();
                    formData.append('code', code);
                    formData.append('user_id', user);
                    formData.append('org_id', org);

                    const response = await axios.post('http://localhost:8000/integrations/hubspot/credentials', formData);
                    const credentials = response.data;

                    if (credentials) {
                        setIsConnected(true);
                        setIntegrationParams(prev => ({ ...prev, credentials, type: 'HubSpot' }));
                        window.history.replaceState({}, document.title, window.location.pathname); 
                    }
                } catch (err) {
                    console.error('OAuth exchange failed:', err);
                }
            })();
        }
    }, [user, org]);

    useEffect(() => {
        setIsConnected(integrationParams?.type === 'HubSpot' && integrationParams?.credentials);
    }, [integrationParams]);

    return (
        <Box sx={{ mt: 2 }}>
            Parameters
            <Box display='flex' alignItems='center' justifyContent='center' sx={{ mt: 2 }}>
                <Button
                    variant='contained'
                    onClick={isConnected ? () => {} : handleConnectClick}
                    color={isConnected ? 'success' : 'primary'}
                    disabled={isConnecting}
                    style={{
                        pointerEvents: isConnected ? 'none' : 'auto',
                        cursor: isConnected ? 'default' : 'pointer',
                        opacity: isConnected ? 1 : undefined
                    }}
                >
                    {isConnected ? 'HubSpot Connected' : isConnecting ? <CircularProgress size={20} /> : 'Connect to HubSpot'}
                </Button>
            </Box>
        </Box>
    );
};
