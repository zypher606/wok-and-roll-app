import React, { useState } from 'react';
import iconMinus from '../../assets/images/minus-solid.svg';
import iconPlus from '../../assets/images/plus-solid.svg';
import {
  ITEM_QUANTITY_LEFT_BUTTON_PLACEHOLDER,
  ITEM_QUANTITY_RIGHT_BUTTON_PLACEHOLDER,
} from '../../constants/app.constants';
import './ItemQuantity.scss';

interface IItemQuantity {
  quantity: number;
  itemsAvailable?: number;
  handleChange: (value: number) => void;
}
export const ItemQuantity = ({ quantity, itemsAvailable, handleChange }: IItemQuantity) => {
  const [quantityValue, setQualtityValue] = useState(quantity);

  const changeQuantity = (value: number) => {
    const result = quantityValue + value;
    if (result < 0 || (itemsAvailable && result > itemsAvailable)) return;

    setQualtityValue(result);
    handleChange(result);
  };

  return (
    <div className='quantity d-flex'>
      <button onClick={() => changeQuantity(-1)} className='quantity-btn d-flex'>
        <img alt={ITEM_QUANTITY_LEFT_BUTTON_PLACEHOLDER} src={iconMinus} />
      </button>
      <div className='quantity-value d-flex'>{quantityValue}</div>

      <button onClick={() => changeQuantity(1)} className='quantity-btn d-flex'>
        <img alt={ITEM_QUANTITY_RIGHT_BUTTON_PLACEHOLDER} src={iconPlus} />
      </button>
    </div>
  );
};
