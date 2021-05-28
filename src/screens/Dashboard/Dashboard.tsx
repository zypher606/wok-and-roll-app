import React, { useState, useEffect } from 'react';
import { Badge, Container, makeStyles, Tab, Tabs, useScrollTrigger, TextField, Button, LinearProgress } from '@material-ui/core';
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
import { User } from '../../models/User';
import logo from "../../assets/images/logo.png";
import { v4 as uuidv4 } from "uuid";
import { APP_VERSION } from '../../constants/app.constants';

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
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState<any>({});
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(true);
  const [versionMismatch, setVersionMismatch] = useState(false);

  const handleChange = (event: any, newValue: any) => {
    setActiveTab(newValue);
    if (newValue === 1) fetchActiveOrders(user);
  };

  useEffect(() => {
    fetchItems();
    fetchUserByPhone(User.getInstance().UserData.phone);
    runVersionChecks();
  }, []);

  const fetchItems = async () => {
    const snapshot: any = await db.collection('items').get();
    const items: any[] = [];
    await snapshot.forEach(async (doc: any) => {
      const data = await doc.data();
      items.push({ ...data, quantity: 0 });
    });

    setItems(items);
    setLoading(false);
  }

  const fetchActiveOrders = async (user: any) => {
    const snapshot: any = await db.collection('orders').where('userId', '==', user.id).get();
    let items: any[] = [];
    await snapshot.forEach(async (doc: any) => {
      const data = await doc.data();
      items.push({ ...data });
    });

    items = items.filter((item: any) => item.status === 'active');
    setActiveOrders(items);
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
    }));
    fetchActiveOrders(user);
  }

  const fetchUserByPhone = async (phone: string) => {
    const snapshot: any = await db.collection('users').where('phoneNumber', '==', phone).get();
    const items: any[] = [];
    await snapshot.forEach(async (doc: any) => {
      const data = await doc.data();
      items.push({ ...data, docId: doc.id });
    });

    let user;
    if (items.length === 0) {
      user = {
        id: uuidv4(),
        displayName: null,
        phoneNumber: phone,
        emailVerified: false,
        dateCreated: new Date().toISOString(),
      }
  
      db.collection('users').add(user)
      .then(res => {})
      .catch(err => {});

    } else {
      user = items[0];
    };
    setUser(user);
    fetchActiveOrders(user);
    if (items.length > 0) setLoading(false);
  }
  
  const saveDisplayName = () => {
    setLoading(true);
    const { docId, ...userData } = user; 
    db.collection("users").doc(docId).update({
      ...userData,
      displayName,
    }).then(res => {
      fetchUserByPhone(User.getInstance().UserData.phone);
    }).catch(err => {});
  }

  const runVersionChecks = async () => {
    const snapshot: any = await db.collection('updates').get();
    const versions: string[] = [];
    await snapshot.forEach(async (doc: any) => {
      const data = await doc.data();
      versions.push(data.version);
    });
    
    const hasNewUpdate =  !versions.every(v => v <= APP_VERSION);
    if (hasNewUpdate) {
      setVersionMismatch(true);
      setLoading(false);
    }
  }

  return (
    <div>

      {
        loading &&
        <div style={{textAlign: 'center'}}>
          <img className='logo' src={logo} alt="app logo" />
          <LinearProgress style={{width: '60%', marginLeft: '20%'}} />
        </div>
      }
      {
        !loading && versionMismatch &&
        <div style={{textAlign: 'center'}}>
          <img className='logo' src={logo} alt="app logo" />
          <h2 style={{fontWeight: 100 }}>A new version has arrived. <br/>Please update from Play Store. <br/>🙂</h2>
        </div>
      }
      {
        !loading && !versionMismatch && user.displayName &&
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
              <Delivery activeOrders={activeOrders} />
            </TabPanel>
            <TabPanel value={activeTab} index={2}>
              <Cart 
                user={user}
                cart={cart} 
                handleOrderSuccess={handleOrderSuccess}/>
            </TabPanel>
            <TabPanel value={activeTab} index={3}>
              <Account user={user} />
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
                <Tab 
                  label="Delivery" 
                  icon={
                    <Badge classes={{ badge: classes.customBadge }} color="secondary" variant={activeOrders.length > 0 ? 'dot' : 'standard'}>
                      <DirectionsBikeIcon />
                    </Badge>
                  } 
                  {...a11yProps(1)} />
                <Tab 
                  label="Cart" 
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
      }

      {
        !loading && !versionMismatch && !user.displayName &&
        <div className="display-name">
          <h1 className="welcome-text">Welcome!</h1>
          <TextField onChange={(e) => setDisplayName(e.target.value)} className="displayNameInput" type="text" label="Your full name" variant="outlined" />
          <br/>

          <div>
            <Button disabled={displayName.length === 0} onClick={saveDisplayName} size='large' className="displayNameSaveBtn" variant="contained" color="primary">
                Next
            </Button>
          </div>
          
        </div>
      }
    </div>
  )
}