import { useSelector, useDispatch } from 'react-redux';
import { GoThumbsup, GoThumbsdown } from 'react-icons/go';

import classes from './FavoriteBtn.module.css';
import { addFavorite, removeFavorite } from '../../store/favoritesSlice';

const FavoriteBtn = ({ isFavorite, firebaseId, exerciseId }) => {
  const { uid, accessToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const toggleFavoritesHandler = () =>
    isFavorite
      ? dispatch(removeFavorite({ uid, firebaseId, accessToken }))
      : dispatch(addFavorite({ uid, exerciseId, accessToken }));

  const btnClasses = [
    classes.Btn,
    isFavorite ? classes.Favorite : classes.NotFavorite,
  ];

  return (
    <button onClick={toggleFavoritesHandler} className={btnClasses.join(' ')}>
      {isFavorite ? 'Unfavorite' : 'Favorite'}
      {isFavorite ? (
        <GoThumbsdown className={classes.Icon} />
      ) : (
        <GoThumbsup className={classes.Icon} />
      )}
    </button>
  );
};

export default FavoriteBtn;
