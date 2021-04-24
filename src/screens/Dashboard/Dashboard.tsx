import React, { useState } from 'react';
import { makeStyles, Tab, Tabs, Container } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';
import FaceIcon from '@material-ui/icons/Face';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import './dashboard.scss';
import Account from './Account';

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
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
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
          Item One
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          Item Two
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          Item Three
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
            <Tab label="Delivery" icon={<DirectionsBikeIcon />} {...a11yProps(1)} />
            <Tab label="Orders" icon={<MenuBookIcon />} {...a11yProps(2)} />
            <Tab label="Account" icon={<FaceIcon />} {...a11yProps(3)} />
        </Tabs>
      </div>
    </div>
  )
}