
export const state = () => ({
  isLoading: false,
  playlists: [],
  activePlaylist: null,
  activePlaylistName: null,
  playlistTrackData: {},
  accessToken: null,
  isLoggedIn: false,
  showErrorMessage: false
})

export const mutations = {
  SET_ACCESS_TOKEN (state, accessToken) {
    state.accessToken = accessToken
    state.isLoggedIn = true
  },
  SET_IS_LOADING (state, loadingState) {
    state.isLoading = loadingState
  },
  SET_PLAYLISTS (state, playlists) {
    state.playlists = playlists
  },
  SET_ACTIVE_PLAYLIST (state, playlist) {
    state.activePlaylist = playlist
    state.playlistTrackData = {}
  },
  ADD_TRACK_DATA (state, trackData) {
    state.playlistTrackData = { ...state.playlistTrackData, ...trackData }
  },
  SORT_PLAYLIST (state, sortType) {
    const sortedPlaylist = state.activePlaylist
    sortedPlaylist.items = sortedPlaylist.items.sort((a, b) => {
      return state.playlistTrackData[a.track.id][sortType] - state.playlistTrackData[b.track.id][sortType]
    })
    state.activePlaylist = sortedPlaylist
  },
  ADD_MORE_TRACKS (state, moreTracks) {
    const currentTracks = state.activePlaylist.items
    state.activePlaylist.next = moreTracks.next
    state.activePlaylist.items = [...currentTracks, ...moreTracks.items]
  },
  SHOW_ERROR_MESSAGE (state, showState) {
    state.showErrorMessage = showState
  }
}

export const actions = {
  setAccessToken ({ commit }, hash) {
    const accessToken = hash.split('=')[1].split('&')[0]
    commit('SET_ACCESS_TOKEN', accessToken)
  },
  async getPlaylists ({ commit }) {
    try {
      const playlists = await this.$axios.$get('https://api.spotify.com/v1/me/playlists', {
        params: {
          access_token: this.state.accessToken
        }
      })
      commit('SET_PLAYLISTS', playlists.items)
    } catch (err) {
      alert(err)
    }
  },
  async getPlaylist ({ commit, dispatch }, [playlistId, playlistName]) {
    try {
      const playlist = await this.$axios.$get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=50`, {
        params: {
          access_token: this.state.accessToken
        }
      })
      commit('SET_ACTIVE_PLAYLIST', { ...{ name: playlistName, ...playlist } })
      dispatch('getTrackData', playlist.items)
    } catch (err) {
      throw new Error(err)
    }
  },
  async getMoreTracks ({ commit, dispatch }, apiCall) {
    try {
      const moreTracks = await this.$axios.$get(apiCall, {
        params: {
          access_token: this.state.accessToken
        }
      })
      commit('ADD_MORE_TRACKS', moreTracks)
      dispatch('getTrackData', moreTracks.items)
    } catch (err) {
      commit('SHOW_ERROR_MESSAGE', true)
    }
  },
  async getTrackData ({ commit }, items) {
    commit('SET_IS_LOADING', true)
    try {
      const trackDataRequests = items.map((item) => {
        return this.$axios.$get(`https://api.spotify.com/v1/audio-features/${item.track.id}`, {
          params: {
            access_token: this.state.accessToken
          }
        })
      })
      const trackData = await Promise.all([...trackDataRequests])
      const formattedData = trackData.reduce((obj, track) => {
        obj[track.id] = track
        return obj
      }, {})
      commit('ADD_TRACK_DATA', formattedData)
    } catch (err) {
      commit('SHOW_ERROR_MESSAGE', true)
    }
    commit('SET_IS_LOADING', false)
  },
  sortPlaylist ({ commit }, sortType) {
    commit('SORT_PLAYLIST', sortType.toLowerCase())
  },
  clearActivePlaylist ({ commit }) {
    commit('SET_ACTIVE_PLAYLIST', null)
    commit('SHOW_ERROR_MESSAGE', false)
  }
}
