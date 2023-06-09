import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

type NoteMetaDataProps = {
  noteData: any;
};

const NoteMetaData = ({ noteData }: NoteMetaDataProps) => {
  const relativeTimeFormatter = new Intl.RelativeTimeFormat('en-CA', {
    style: 'short',
  });
  const absoluteTimeFormatter = new Intl.DateTimeFormat('en-CA', {
    dateStyle: 'short',
    timeStyle: 'short',
  });

  const [lastUpdated, setLastUpdated] = useState<any>(null);
  const lastUpdatedInterval = useRef<any>();

  const calculateLastUpdated = () => {
    const now = new Date();
    const lastUpdated = new Date(noteData.updated_at);

    const diff = lastUpdated.getTime() - now.getTime();
    const diffInSeconds = Math.floor(diff / 1000);
    const diffInMinutes = Math.floor(diff / (1000 * 60));

    if (diffInSeconds > -60) {
      if (diffInSeconds > -5) {
        setLastUpdated('just now');
        return;
      }
      setLastUpdated(relativeTimeFormatter.format(diffInSeconds, 'seconds'));
    } else if (diffInMinutes > -60) {
      setLastUpdated(relativeTimeFormatter.format(diffInMinutes, 'minutes'));
    } else if (diffInMinutes > -1 * (24 * 60)) {
      setLastUpdated(
        relativeTimeFormatter.format(Math.floor(diffInMinutes / 60), 'hours')
      );
    } else {
      setLastUpdated(absoluteTimeFormatter.format(lastUpdated));
    }
  };

  useMemo(() => {
    calculateLastUpdated();
    clearInterval(lastUpdatedInterval.current);
    const interval = setInterval(() => {
      console.log('running interval');
      calculateLastUpdated();
    }, 1000 * 29);
    lastUpdatedInterval.current = interval;
  }, [noteData.updated_at]);

  useEffect(() => {
    return () => {
      if (lastUpdatedInterval) {
        clearInterval(lastUpdatedInterval.current);
      }
    };
  }, []);

  return (
    <div className="note-metadata">
      <p>
        Created: {absoluteTimeFormatter.format(new Date(noteData.created_at))}
      </p>
      <p>Last saved: {lastUpdated}</p>
    </div>
  );
};

export default NoteMetaData;
