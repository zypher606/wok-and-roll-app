import React, { useState, useEffect } from 'react';
import { Badge, Container, makeStyles, Tab, Tabs } from '@material-ui/core';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';
import FaceIcon from '@material-ui/icons/Face';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import Account from './Account';
import AddItem from './AddItem';
import ItemList from './ItemList';
import Cart from './Cart';
import firebase from 'firebase';
import './dashboard.scss';
import Delivery from './Delivery';

const db = firebase.firestore();

interface ITabPanel {
  children: any;
  index: any;
  value: any;
};

function TabPanel(props: ITabPanel) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {
        value === index && (
        <Container className="tab-panel-container">
          {children}
        </Container>
      )}
    </div>
  );
}


function a11yProps(index: any) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  customBadge: {
    backgroundColor: "#3f51b5",
    color: "white"
  },
}));

export default function Dashboard() {

  const classes = useStyles();
  const [activeTab, setActiveTab] = useState(0);
  const [items, setItems] = useState<any[]>([]);
  const [cart, setCart] = useState([]);

  const handleChange = (event: any, newValue: any) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const snapshot: any = await db.collection('items').get();
    const items: any[] = [];
    await snapshot.forEach(async (doc: any) => {
      const data = await doc.data();
      items.push({ ...data, quantity: 0 });
    });

    setItems(items);
  }

  const handleQuantityChange = (payload: {id: string, quantity: number}) => {

    setItems(items.map((item: any) => {
      if (item.id === payload.id) {
        return { ...item, quantity: payload.quantity };
      };
      return item;
    }))

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

  const handleOrderSuccess = () => {
    setCart([]);
    setItems(items.map((item: any) => {
      return { ...item, quantity: 0 };
    }))
  }

  return (
    <div>
      <div className="tab-body">
        <TabPanel value={activeTab} index={0}>
          <ItemList 
            cart={cart} 
            setCart={setCart} 
            items={items} 
            handleQuantityChange={handleQuantityChange} />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <Delivery />
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          <Cart 
            cart={cart} 
            handleOrderSuccess={handleOrderSuccess}/>
        </TabPanel>
        <TabPanel value={activeTab} index={3}>
          <Account />
        </TabPanel>
      </div>

      <div className="tab-bar-container">
        <Tabs
            value={activeTab}
            onChange={handleChange}
            variant="fullWidth"
            scrollButtons="on"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Menu" icon={<FastfoodIcon />} {...a11yProps(0)} />
            {/* <Tab label="Add" icon={<AddIcon />} {...a11yProps(1)} /> */}
            <Tab label="Delivery" icon={<DirectionsBikeIcon />} {...a11yProps(1)} />
            <Tab label="Cart" 
              icon={
                <Badge 
                  classes={{ badge: classes.customBadge }} 
                  badgeContent={cart.length}>
                    <MenuBookIcon />
                </Badge>
              } 
              {...a11yProps(2)} 
            />
            <Tab label="Account" icon={<FaceIcon />} {...a11yProps(3)} />
        </Tabs>
      </div>
    </div>
  )
}