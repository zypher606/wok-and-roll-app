import React, { useState } from 'react';
import { Badge, Container, makeStyles, Tab, Tabs } from '@material-ui/core';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';
import FaceIcon from '@material-ui/icons/Face';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import Account from './Account';
import AddItem from './AddItem';
import ItemList from './ItemList';
import './dashboard.scss';

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

  const handleChange = (event: any, newValue: any) => {
    setActiveTab(newValue);
  };

  return (
    <div>
      <div className="tab-body">
        <TabPanel value={activeTab} index={0}>
          <ItemList />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <AddItem />
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          Orders
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
            <Tab label="Orders" 
              icon={
                <Badge 
                  classes={{ badge: classes.customBadge }} 
                  badgeContent={4}>
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