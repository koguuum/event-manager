import React, { useState, useEffect } from 'react';
import Header from './Header';
import EventList from './EventList';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Event from './Event';
import EventForm from './EventForm';

const Editor = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await window.fetch('/api/events');
        if (!response.ok) throw Error(response.statusText);
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        setIsError(true);
        console.error(error);
      }

      setIsLoading(false);
    };

    fetchData();
  }, []);

  const addEvent = async (newEvent) => {
    try {
      const response = await window.fetch('/api/events', {
        method: 'POST',
        body: JSON.stringify(newEvent),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw Error(response.statusText);

      const savedEvent = await response.json();
      const newEvents = [...events, savedEvent];
      setEvents(newEvents);
      window.alert('Eventの作成に成功しました');
      navigate(`/events/${savedEvent.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      // （省略）
      <Routes>
        <Route path='new' element={<EventForm onSave={addEvent} />} />
        <Route path=':id' element={<Event events={events} />} />
      </Routes>
      // （省略）
    </>
  );
};

export default Editor;
