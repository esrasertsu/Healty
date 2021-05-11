import React from 'react'
import StarRatingComponent from 'react-star-rating-component';
import { Icon } from 'semantic-ui-react';

interface IProps{
    rating:number;
    setRating?: (rating:number) => void;
    editing: boolean;
    size?:"large" | "mini" | "tiny" | "small" | "big" | "huge" | "massive" | undefined;
    count?:number;
    showCount: boolean;
}
export const StarRating:React.FC<IProps> = ({rating,setRating,editing,size,count, showCount}) => {

    const clickStar = (nextValue:number, prevValue:number, name:string) => {
        setRating!(nextValue);
    }

    return (
        <div className="starRating_container">
        <div className="starRating">
         <StarRatingComponent 
          name="starCount" 
          editing={editing}
          starCount={5}
          value={rating}
          onStarClick={clickStar}
          renderStarIcon={(index, value) => {
            return (
                <Icon inverted color={index <= value ? "yellow" : "grey"} name={index <= value ? "star" : "star outline"} size={size===undefined?'large':size} />
            );
          }}
        />
         <span className="starRating_Rating">{rating}</span>
       </div>
       {showCount && 
          <div className="starRating_Count">{count} Değerlendirme</div> 
        }
       
     </div>
    )
}