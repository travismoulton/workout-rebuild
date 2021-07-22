import { useSelector, useDispatch } from 'react-redux';
import { GoThumbsup, GoThumbsdown } from 'react-icons/go';

import classes from './FavoriteBtn.module.css';
import {
  addFavorite,
  removeFavorite,
  selectFavoriteFirebaseId,
} from '../../store/favoritesSlice';

export default function FavoriteBtn({ exerciseId }) {
  const { uid, accessToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const firebaseId = useSelector((state) =>
    selectFavoriteFirebaseId(state, exerciseId)
  );

  const isFavorite = firebaseId ? true : false;

  const toggleFavoritesHandler = () =>
    isFavorite
      ? dispatch(removeFavorite({ uid, firebaseId, accessToken }))
      : dispatch(addFavorite({ uid, exerciseId, accessToken }));

  // const toggleFavoritesHandler = () => {
  //   if (isFavorite) {
  //     console.log('removeFavorite');
  //     dispatch(removeFavorite({ uid, firebaseId, accessToken }));
  //   } else {
  //     console.log('addFavorite');
  //     dispatch(addFavorite({ uid, exerciseId, accessToken }));
  //   }
  // };

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
}
