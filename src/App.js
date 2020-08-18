import React, { useEffect, useState } from 'react';
import './App.css';
import Login from './Components/Login';
import { getUrlToken } from './Spotify';
import Player from './Components/Player';
import SpotifyWebApi from 'spotify-web-api-js';
import { useDataLayerValue } from './DataLayer';
import * as actions from './actionTypes';

const spotify = new SpotifyWebApi();

function App() {
  const [{ user, token }, dispatch] = useDataLayerValue();  

  useEffect(() => {
    const hash = getUrlToken();
    const _token = hash.access_token;
    window.location.hash = '';

    dispatch({
      type: actions.SET_SPOTIFY,
      payload: spotify,
    });

    if (_token) {
      dispatch({
        type: actions.SET_TOKEN,
        payload: _token,
      });

      spotify.setAccessToken(_token);

      spotify
        .getMe()
        .then((user) => dispatch({ type: actions.SET_USER, payload: user }));

      spotify
        .getUserPlaylists()
        .then((playlists) =>
          dispatch({ type: actions.SET_PLAYLIST, payload: playlists })
        );

      spotify.getCategories({ country: 'IN' }).then((categories) => {
        dispatch({
          type: actions.SET_CATEGORIES,
          payload: categories.categories,
        });
      });

      spotify.getCategoryPlaylists('toplists').then((currentCategory) => {
        dispatch({
          type: actions.SET_CURRENT_CATEGORY,
          payload: currentCategory,
        });
      });

      spotify.getMyRecentlyPlayedTracks().then((recentTracks) => {
        dispatch({ type: actions.SET_RECENT_TRACKS, payload: recentTracks });
      });

    }

    return () => {};
  }, []);

  return (
    <div className="app">
      {token ? <Player spotify={spotify} /> : <Login />}
    </div>
  );
}

export default App;
