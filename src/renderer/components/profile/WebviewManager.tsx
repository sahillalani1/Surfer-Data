import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight, X, Square, Bug } from 'lucide-react';
import { IAppState } from '../../types/interfaces';
import { setActiveRunIndex, closeRun, toggleRunVisibility, stopRun, adjustActiveRunIndex, updateExportStatus } from '../../state/actions';
import { platforms } from '../../config/platforms';
import { useTheme } from '../ui/theme-provider';
import { openDB } from 'idb'; // Import openDB for IndexedDB operations
import { Button } from '../ui/button';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert'

const FullScreenOverlay = styled.div<{ isVisible: boolean }>`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 50;
  display: flex;
  flex-direction: column;
  opacity: ${props => props.isVisible ? 1 : 0};
  pointer-events: ${props => props.isVisible ? 'auto' : 'none'};
  transition: opacity 0.1s ease-in-out;
`;

const WebviewContainer = styled.div`
  flex-grow: 1;
  padding: 16px;
  background-color: #f0f0f0;
`;

const FakeBrowser = styled.div`
  background-color: #2c2c2c;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 100%;
`;

const BrowserHeader = styled.div`
  background-color: #3c3c3c;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const RunCounter = styled.span`
  color: white;
  font-size: 14px;
`;

const RightSection = styled.div`
  display: flex;
  gap: 16px;
`;

const HeaderButton = styled.button`
  background-color: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #ffffff1a;
  }
`;

const StopButton = styled(HeaderButton)`
  background-color: #ff5f56;
  color: white;

  &:hover {
    background-color: #ff3b30;
  }
`;

const TrafficLights = styled.div`
  display: flex;
  gap: 8px;
`;

const TrafficLight = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
`;

const NavButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s;
  color: white;

  &:hover {
    background-color: ${(props) =>
      props.disabled ? 'transparent' : '#ffffff1a'};
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 16px;
`;

const Tab = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LOGO_SIZE = 24;

interface WebviewManagerProps {
  webviewRef: React.RefObject<HTMLIFrameElement>;
  isConnected: boolean;
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
}

const WebviewManager: React.FC<WebviewManagerProps> = ({ webviewRef, isConnected, setIsConnected }) => {
  const dispatch = useDispatch();
  const runs = useSelector((state: IAppState) => state.runs);
  const activeRunIndex = useSelector((state: IAppState) => state.activeRunIndex);
  const isRunLayerVisible = useSelector((state: IAppState) => state.isRunLayerVisible);

  const { theme } = useTheme();

  useEffect(() => {
    if (runs.length === 0 && isRunLayerVisible) {
      dispatch(toggleRunVisibility());

    }
  }, [runs, isRunLayerVisible, dispatch]);

  const handleNewRun = async () => {
  setIsConnected(true)
  const newRun = runs[runs.length - 1];
  if (newRun && newRun.status === 'running') {
    console.log('Run started:', newRun.id);

    // Parse the run ID
    const parsedId = newRun.id.split('-').slice(0, 2).join('-');

    // Find the corresponding platform
    const platform = platforms.find(p => p.id === parsedId);

    if (platform) {
      if (webviewRef.current) {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        console.log('exporting this: ', platform.company, platform.name)
        webviewRef.current.send('export-website', platform.company, platform.name, newRun.id);
      }
    } else {
      console.error('Platform not found for ID:', parsedId);
    }
  }
};

  useEffect(() => {
    const webview = webviewRef.current;
    console.log('webview use effect listener called!');
    
    const ipcMessageHandler = (event) => {
      const { channel, args } = event; // Assuming the event has channel and args properties
      console.log(`Received IPC message on channel: ${channel}`, args);
      if (channel === 'get-run-id') {
        const runningRuns = runs.filter(run => run.status === 'running');
        if (runningRuns.length > 0) {
          console.log('sent run id');
          webview.send('got-run-id', runningRuns[runningRuns.length - 1].id);
        }
      }
      // Handle the IPC message as needed
    };

    if (webview) {
      webview.addEventListener('ipc-message', ipcMessageHandler);
    }

    // return () => {
    //   if (webview) {
    //     webview.removeEventListener('ipc-message', ipcMessageHandler);
    //   }
    // };
  }, []);

  useEffect(() => {
    if (runs.length > 0) {
      console.log('THIS RUNS ', runs)
    handleNewRun();
    }

  }, [runs.length]);

  useEffect(() => {
    dispatch(adjustActiveRunIndex());
  }, [runs.length, dispatch]);

  const handlePrevRun = () => {
    dispatch(setActiveRunIndex(activeRunIndex - 1));
  };

  const handleNextRun = () => {
    dispatch(setActiveRunIndex(activeRunIndex + 1));
  };

  const handleCloseRun = (runId: string) => {
    dispatch(closeRun(runId));
    if (runs.length === 1) {
      dispatch(toggleRunVisibility());
    }
  };

  const getPlatformLogo = (platform) => {
    if (!platform || !platform.logo) return null;
    const Logo = theme === 'dark' ? platform.logo.dark : platform.logo.light;
    return Logo ? (
      <div style={{ width: `${LOGO_SIZE}px`, height: `${LOGO_SIZE}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Logo style={{ width: '100%', height: '100%' }} />
      </div>
    ) : null;
  };

  const handleRunDetails = () => {
    // Implement run details functionality
    console.log("Run details clicked");
  };

  const handleLearnMode = () => {
    // Implement learn mode functionality
    console.log("Learn mode clicked");
  };

  const handleStopRun = async () => {
    const activeRun = runs[activeRunIndex];
    if (activeRun && (activeRun.status === 'pending' || activeRun.status === 'running')) {
      dispatch(stopRun(activeRun.id));
      console.log("Stopping run:", activeRun.id);

      // Update the run in IndexedDB
      const db = await openDB('dataExtractionDB', 1);
      const updatedRun = { ...activeRun, status: 'stopped', endDate: new Date().toISOString() };
      await db.put('runs', updatedRun);

      // Remove the run from Redux state
      dispatch(closeRun(activeRun.id));

      // Adjust active run index if necessary
      if (activeRunIndex >= runs.length - 1) {
        dispatch(setActiveRunIndex(Math.max(0, runs.length - 2)));
      }
    }
  };

  const isActiveRunStoppable = () => {
    const activeRun = runs[activeRunIndex];
    return activeRun && (activeRun.status === 'pending' || activeRun.status === 'running');
  };

  const activeRuns = runs.filter(run => run.status === 'pending' || run.status === 'running');
  const currentRunIndex = Math.min(activeRunIndex, activeRuns.length - 1);

  const handleOpenDevTools = () => {
    if (webviewRef.current) {
      webviewRef.current.openDevTools();
    }
  };

   function modifyUserAgent(userAgent) {
    // Regular expression to match the Chrome version
    const chromeVersionRegex = /(Chrome\/)\d+(\.\d+){3}/;

    // Replace the Chrome version with 127.0.0.0
    return userAgent.replace(chromeVersionRegex, '$1127.0.0.0');
  }


  useEffect(() => {
    const webview = webviewRef.current;
    if (webview) {


      const setWebview = () => {
        const oldAgent = webview.getUserAgent();
        const newAgent = modifyUserAgent(oldAgent);

        webview.setUserAgent(newAgent);
        webview.setZoomFactor(0.8);
      };

      // const handleStartLoading = () => setIsLoading(true);
      // const handleStopLoading = () => setIsLoading(false);

      webview.addEventListener('dom-ready', setWebview);
      webview.addEventListener('did-navigate', setWebview);
      webview.addEventListener('did-navigate-in-page', setWebview);
      // webview.addEventListener('did-start-loading', handleStartLoading);
      // webview.addEventListener('did-stop-loading', handleStopLoading);

      return () => {
        webview.removeEventListener('dom-ready', setWebview);
        webview.removeEventListener('did-navigate', setWebview);
        webview.removeEventListener('did-navigate-in-page', setWebview);
        // webview.removeEventListener('did-start-loading', handleStartLoading);
        // webview.removeEventListener('did-stop-loading', handleStopLoading);
      };
    }
  }, [webviewRef.current]);

  return (
    <FullScreenOverlay isVisible={isRunLayerVisible}>
      <WebviewContainer>
        <FakeBrowser>
          <BrowserHeader>
            <LeftSection>
              <NavButtons>

                  <IconButton onClick={handleOpenDevTools}>
                    <Bug size={18} color="#ffffffb3" />
                  </IconButton>
                <IconButton onClick={handlePrevRun} disabled={activeRunIndex === 0}>
                  <ChevronLeft size={16} />
                </IconButton>
                <RunCounter>{`${currentRunIndex + 1}/${activeRuns.length}`}</RunCounter>
                <IconButton onClick={handleNextRun} disabled={activeRunIndex === activeRuns.length - 1}>
                  <ChevronRight size={16} />
                </IconButton>
              </NavButtons>
            </LeftSection>
            <RightSection>
              {!isConnected && (<Button onClick={handleNewRun}>I've signed in!</Button>)}
              <HeaderButton onClick={handleRunDetails}>Run Details</HeaderButton>
              <HeaderButton onClick={handleLearnMode}>Learn Mode</HeaderButton>
              {isActiveRunStoppable() && (
                <StopButton onClick={handleStopRun}>
                  <Square size={16} style={{ marginRight: '4px' }} />
                  Stop Run
                </StopButton>
              )}
              <TrafficLights>
                <TrafficLight color="#ff5f56" />
                <TrafficLight color="#ffbd2e" />
                <TrafficLight color="#27c93f" />
              </TrafficLights>
            </RightSection>
          </BrowserHeader>
          <div style={{ position: 'relative', height: 'calc(100% - 40px)' }}>
            {activeRuns.map((run, index) => (
              <webview
                key={run.id}
                src={run.url}
                ref={webviewRef}
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  opacity: index === currentRunIndex ? 1 : 0,
                  pointerEvents: index === currentRunIndex && isRunLayerVisible ? 'auto' : 'none',
                }}
                id={`webview-${run.id}`}
                allowpopups=""
                nodeintegration="true"
                crossorigin="anonymous"
              />
            ))}
          </div>
        </FakeBrowser>
      </WebviewContainer>


    </FullScreenOverlay>
  );
};

export default WebviewManager;
