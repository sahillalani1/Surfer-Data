import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startRun, toggleRunVisibility, setExportRunning, updateExportStatus } from '../../state/actions';
import { useTheme } from '../ui/theme-provider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { ArrowUpRight, ArrowRight, Check, X, Link, Download, Search, ChevronLeft, ChevronRight, HardDriveDownload } from 'lucide-react';
import { platforms } from '../../config/platforms';
import { openDB } from 'idb';
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Checkbox } from "../ui/checkbox";
import { formatDistanceToNow, parseISO } from 'date-fns';

const DataExtractionTable = ({ onPlatformClick, webviewRef }) => {
  const dispatch = useDispatch();
  const runs = useSelector(state => state.runs);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const { theme } = useTheme(); // Get the current theme
  const [dbUpdateTrigger, setDbUpdateTrigger] = useState(0);
  const dbRef = useRef(null);

  const LOGO_SIZE = 24; // Set a consistent size for all logos

  const loadRuns = useCallback(async () => {
    const db = await openDB('dataExtractionDB', 1, {
      upgrade(db) {
        db.createObjectStore('runs', { keyPath: 'id' });
      },
    });
    dbRef.current = db;
    const loadedRuns = await db.getAll('runs');
    loadedRuns.forEach(run => {
      dispatch(updateExportStatus(run.platformId, run));
    });
  }, [dispatch]);

  useEffect(() => {
    loadRuns();

    return () => {
      if (dbRef.current) {
        dbRef.current.close();
      }
    };
  }, [loadRuns, dbUpdateTrigger]);

  useEffect(() => {
    const handleDbChange = () => {
      setDbUpdateTrigger(prev => prev + 1);
    };

    window.electron.ipcRenderer.on('db-changed', handleDbChange);

    return () => {
      window.electron.ipcRenderer.removeListener('db-changed', handleDbChange);
    };
  }, []);

  useEffect(() => {
    const handleExportComplete = (platformId, exportData, runID) => {
      console.log('stopping run for platform id: ', platformId, ', and name: ', exportData, ', and runID: ', runID)
      dispatch(updateExportStatus(platformId, exportData, runID));
    };

    window.electron.ipcRenderer.on('export-complete', handleExportComplete);

    return () => {
      window.electron.ipcRenderer.removeListener('export-complete', handleExportComplete);
    };
  }, [dispatch]);

  const getLatestRun = useCallback((platformId) => {
    const platformRuns = runs.filter(run => run.platformId === platformId);
    if (platformRuns.length === 0) return null;

    return platformRuns.reduce((latest, current) => {
      const latestDate = latest.startDate ? new Date(latest.startDate) : new Date(0);
      const currentDate = current.startDate ? new Date(current.startDate) : new Date(0);
      return currentDate > latestDate ? current : latest;
    });
  }, [runs]);

  const renderSubRuns = (subRuns) => {
    const displayCount = 2;
    const displayedRuns = subRuns.slice(0, displayCount);
    const remainingCount = subRuns.length - displayCount;

    return (
      <div>
        {displayedRuns.map((subRun, index) => (
          <span key={subRun.id} className="text-sm text-gray-600">
            {subRun.name}{index < displayedRuns.length - 1 ? ', ' : ''}
          </span>
        ))}
        {remainingCount > 0 && (
          <span className="text-sm text-gray-600"> +{remainingCount} more</span>
        )}
      </div>
    );
  };

  const filteredPlatforms = platforms.filter(platform =>
    platform.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageCount = Math.ceil(filteredPlatforms.length / itemsPerPage);
  const paginatedPlatforms = filteredPlatforms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const clearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleExportClick = async (platform) => {
    const newRun = {
      id: `${platform.id}-${Date.now()}`,
      platformId: platform.id,
      subRunId: 'export',
      startDate: new Date().toISOString(),
      status: 'running',
      tasks: [],
      url: platform.home_url,
    };

    dispatch(startRun(newRun));
    dispatch(toggleRunVisibility());
    dispatch(setExportRunning(platform.id, true));

    // Trigger the export process
    window.electron.ipcRenderer.send('export-website', platform.company, platform.name, newRun.id);
  };

  const formatLastRunTime = (dateString) => {
    if (!dateString) return 'Never';
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true })
      .replace(/^about /, '')
      .replace(/^less than /, '<')
      .replace(/^almost /, '');
  };

  const getPlatformLogo = (platform) => {
    const Logo = theme === 'dark' ? platform.logo.dark : platform.logo.light;
    return Logo ? (
      <div style={{ width: `${LOGO_SIZE}px`, height: `${LOGO_SIZE}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Logo style={{ width: '100%', height: '100%' }} />
      </div>
    ) : null;
  };

  return (
    <div className="w-full mx-auto space-y-4 px-[50px] select-none">
      <div className="flex items-center mb-4">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Search platforms..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 pr-10"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>
      {paginatedPlatforms.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Platform</TableHead>
                  <TableHead>Export Status</TableHead>
                  <TableHead>Actions</TableHead>
                  <TableHead>Last Run</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPlatforms.map((platform) => {
                  const latestRun = getLatestRun(platform.id);
                  const logoComponent = getPlatformLogo(platform);

                  return (
                    <TableRow key={platform.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          {/* <div className={`w-2 h-2 rounded-full ${platform.isConnected ? 'bg-green-500' : 'bg-red-500'}`} /> */}
                          {logoComponent}
                          <div className="flex flex-col">
                            <p className="cursor-pointer hover:underline" onClick={() => onPlatformClick(platform)}>
                              <span className="text-gray-500">{platform.company}/</span>
                              <span className="font-semibold">{platform.name}</span>
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{latestRun?.exportStatus || 'Not Started'}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center"
                            onClick={() => handleExportClick(platform)}
                          >
                            <HardDriveDownload size={16} className="mr-2" />
                            Export
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        {latestRun && (
                          <div className="flex items-center space-x-2">
                            {latestRun.status === 'success' ? (
                              <>
                                <Check className="text-green-500" size={16} />
                                <span>{latestRun.exportSize}</span>
                                <span>{formatLastRunTime(latestRun.exportDate)}</span>
                                {latestRun.exportPath && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => window.electron.ipcRenderer.send('open-folder', latestRun.exportPath)}
                                  >
                                    Open Folder
                                  </Button>
                                )}
                              </>
                            ) : latestRun.status === 'running' ? (
                              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <X className="text-red-500" size={16} />
                            )}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          {filteredPlatforms.length > itemsPerPage && (
            <div className="flex justify-between items-center mt-4">
              <div>
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredPlatforms.length)} of {filteredPlatforms.length} platforms
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={16} />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pageCount}
                >
                  Next
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 bg-gray-100 rounded-md">
          <p className="text-gray-500 text-lg">No platforms found matching "{searchTerm}"</p>
          <button
            onClick={clearSearch}
            className="mt-2 text-blue-500 hover:underline"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
};

export default DataExtractionTable;
