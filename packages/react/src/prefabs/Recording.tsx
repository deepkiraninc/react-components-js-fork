import React, { useEffect, useState, useRef } from 'react';
import { useRoomContext } from '../context';
import { Chevron, RecordingIcon } from '../assets/icons';

interface RecordingControlsProps {
  onRecordingChange?: (val: boolean) => void;
}

export default function RecordingControls({ onRecordingChange }: RecordingControlsProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const room = useRoomContext();

  const getMeetingId = () => {
    const pathParts = window.location.pathname.split('/');
    return pathParts[2] || null;
  };

  useEffect(() => {
    if (room?.metadata) {
      try {
        const parsed = JSON.parse(room.metadata);
        const recordingActive = parsed.recordingStarted === true;
        setIsRecording(recordingActive);
        onRecordingChange?.(recordingActive);
      } catch (err) {
        console.error('Error parsing metadata:', err);
      }
    }
  }, [room?.metadata]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node) &&
      !buttonRef.current?.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleRecording = async (action: string, type?: string) => {
    const meetingId = getMeetingId();

    setIsLoading(true);
    setIsOpen(false);

    try {
      const internalEndpoint =
        action === 'stop' ? `/api/stop/${meetingId}` : `/api/start/${meetingId}`;

      const fetchOptions: RequestInit = {
        method: 'POST'
      };

      if (type === 'image') {
        fetchOptions.headers = {
          ...fetchOptions.headers,
          'Content-Type': 'application/json',
        };
        fetchOptions.body = JSON.stringify({ type: 'image' });
      }

      const response = await fetch(internalEndpoint, fetchOptions);
      const data = await response.json();

      if (!response.ok) {
        console.error('Team Locus Error:', data);
        throw new Error(data.errorMessage || data.message || 'Recording API error');
      }

      const newRecordingState = action !== 'stop';
      setIsRecording(newRecordingState);
      onRecordingChange?.(newRecordingState);

      console.log('Response:', data);
    } catch (error: any) {
      console.error('Toggle recording error:', error);
      alert(`Recording Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative inline-block">
      {/* Dropdown Menu */}
      {isOpen && (
        <div ref={menuRef} style={{ position: 'absolute', bottom: '60px' }}>
          <ul className="lk-recording-menu">
            <li>
              <button
                onClick={() => {
                  handleRecording('start', 'image');
                  setIsOpen(false);
                }}
                className="lk-recording-button"
              >
                Image Recording
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  handleRecording('start');
                  setIsOpen(false);
                }}
                className="lk-recording-button"
              >
                Video Recording
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* Start/Stop Button */}
      <button
        className="lk-button"
        aria-pressed={isOpen}
        onClick={() => {
          if (isRecording) {
            handleRecording('stop');
          } else {
            toggleMenu();
          }
        }}
        ref={buttonRef}
      >
        {isLoading ? (
          'Processing...'
        ) : (
          <>
            <RecordingIcon color={isRecording ? 'red' : 'green'} />
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </>
        )}{' '}
        <Chevron className="lk-recording-arrow" />
      </button>
    </div>
  );
}
