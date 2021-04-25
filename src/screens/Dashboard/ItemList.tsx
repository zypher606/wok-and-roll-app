import React, { useEffect, useState } from "react";
import { ItemCard, Alert } from "../../components";
import firebase from 'firebase';
import { Snackbar } from "@material-ui/core";

const db = firebase.firestore();

export default function ItemList() {

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

  const handleDelete = async (id: string) => {
    const snapshot: any = await db.collection('items').where('id', '==', id).get();
    snapshot.forEach((doc: any) => {
      doc.ref.delete();
    });
    setOpenSuccessToast(true);
    fetchItems();
  }

  return (
    <div>
      <ul className="item-collection">
        {
          items.map(item => (
            <li key={item.id} className="list-item">
              <ItemCard item={item} handleDelete={handleDelete} />
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