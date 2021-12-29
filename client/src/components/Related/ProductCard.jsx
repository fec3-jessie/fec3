import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {url, token} from '/config.js';

const ProductCard = (props) => {
  const item = props.product;
  const [defaultStyle, setDefaultStyle] = useState({});
  const [starAverage, setStarAverage] = useState(0);

  useEffect(() => {
    axios.get(`${url}/products/${item.id}/styles`, {
      headers: { 'Authorization': token }
    })
    .then(res => {
      let styles = res.data.results;
      const [style] = styles.filter(style => style['default?'] === true);
      setDefaultStyle(style);
    })
    .then(() => {
      axios.get(`${url}/reviews/meta?product_id=${item.id}`, {
        headers: { 'Authorization': token }
      })
      .then(res => {
        const ratings = res.data.ratings;
        let [score, reviews] = [0, 0];
        for (const key in ratings) {
          reviews += parseInt(ratings[key]); //adds review count to denominator
          score += parseInt(ratings[key]) * parseInt(key); //adds score to numerator
        }
        const value = Math.round(score/reviews * 100) / 100; //rounds to two places
        setStarAverage(value);
      })
    })
  }, [])


  return (<div className='product-card'>
    <img className='related-img' src = {defaultStyle.photos?.[0].thumbnail_url || 'https://png.vector.me/files/images/1/5/151985/none_icon_available_no_unavailable_preview.jpg'}/><br></br>
    <span className='card-details'>{item.category}</span><br></br>
    <span className='product-name'>{item.name}</span><br></br>
    <span className='related-price'>${defaultStyle.original_price}</span><br></br>
    <span className='related-stars'>{starAverage} stars</span>
  </div>)
}

export default ProductCard;