import React, { useEffect, useState } from "react";
import { ItemCard, Alert } from "../../components";
import firebase from 'firebase';
import { Snackbar } from "@material-ui/core";

const db = firebase.firestore();

export default function ItemList({ cart, setCart }: any) {

  const [items, setItems] = useState<any[]>([]);
  const [openSuccessToast, setOpenSuccessToast] = useState(false);
  const [openErrorToast, setOpenErrorToast] = useState(false);

  useEffect(() => {

    fetchItems();
    
  }, [])

  const fetchItems = async () => {
    const snapshot: any = await db.collection('items').get();
    const items: any[] = [];
    await snapshot.forEach(async (doc: any) => {
      const data = await doc.data();
      items.push(data);
    });

    setItems(items);
  }

  // const handleDelete = async (id: string) => {
  //   const snapshot: any = await db.collection('items').where('id', '==', id).get();
  //   snapshot.forEach((doc: any) => {
  //     doc.ref.delete();
  //   });
  //   setOpenSuccessToast(true);
  //   fetchItems();
  // }

  const handleQuantityChange = (payload: {id: string, quantity: number}) => {
    if (payload.quantity === 0) {
      setCart(cart.filter((item: any) => item.id !== payload.id));
      return;
    }

    const isInCart = cart.find((item: any) => item.id === payload.id);
    let newCart: any;
    if (isInCart) {
      newCart = cart.map((item: any) => {
        if (item.id === payload.id) {
          return { ...item, quantity: payload.quantity };
        }
        return item;
      });
    } else {
      const newItem = items.find((item: any) => item.id === payload.id);
      newCart= [...cart, { ...newItem, quantity: payload.quantity }];
    }
    
    setCart(newCart);
  }

  return (
    <div>
      <ul className="item-collection">
        {
          items.map(item => (
            <li key={item.id} className="list-item">
              <ItemCard item={item} handleQuantityChange={handleQuantityChange} />
            </li>
          ))
        }
      </ul>

      <Snackbar open={openSuccessToast} autoHideDuration={4000} onClose={() => setOpenSuccessToast(false)}>
        <Alert onClose={() => setOpenSuccessToast(false)} severity="success">
          Item deleted successfully!
        </Alert>
      </Snackbar>

      <Snackbar open={openErrorToast} autoHideDuration={4000} onClose={() => setOpenErrorToast(false)}>
        <Alert onClose={() => setOpenErrorToast(false)} severity="error">
          SOme error occured!
        </Alert>
      </Snackbar>
    </div>
    
  )
}