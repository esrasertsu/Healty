import React from 'react'
import StarRatingComponent from 'react-star-rating-component';
import { Icon } from 'semantic-ui-react';

interface IProps{
    rating:number;
    setRating?: (rating:number) => void;
    editing: boolean;
}
export const StarRating:React.FC<IProps> = ({rating,setRating,editing}) => {

    const clickStar = (nextValue:number, prevValue:number, name:string) => {
        setRating!(nextValue);
    }

    return (
        <div>
        <StarRatingComponent 
          name="starCount" 
          editing={editing}
          starCount={5}
          value={rating}
          onStarClick={clickStar}
          renderStarIcon={(index, value) => {
            return (
                <Icon inverted color={index <= value ? "yellow" : "grey"} name={index <= value ? "star" : "star outline"} size='large' />
            );
          }}
        />
        </div>
    )
}
