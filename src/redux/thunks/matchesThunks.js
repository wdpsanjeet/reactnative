import { fetchMatchesStart, fetchMatchesSuccess, fetchMatchesFailure } from '../reducers/matchesSlice';

export const fetchMatches = () => async (dispatch) => {
  try {
    dispatch(fetchMatchesStart());
    const response = await fetch('https://api.example.com/ipl/matches');
    const data = await response.json();
    dispatch(fetchMatchesSuccess(data.matches));
  } catch (error) {
    dispatch(fetchMatchesFailure(error.message));
  }
};